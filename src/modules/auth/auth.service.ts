import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import SignUp from './dto/sign_up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './auth.schema';
import Login from './dto/login.dto';
import { CustomException } from 'src/exceptions/custom.exception';
import { JwtService } from '@nestjs/jwt';
import UpdateUser from './dto/update_user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import ChangePassword from './dto/change_password.dto';
import { EmailService } from 'src/email/email.service';
import ResetPassword from './dto/reset_password.dto';
import CodeSend from './dto/code_send.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly JwtService: JwtService,
    private readonly CloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
  ) {}
  async sign_up(User: SignUp) {
    if (User.password !== User.confirmPassword) {
      throw new CustomException('password not match', 400);
    }
    User.password = await bcrypt.hash(User.password, 10);
    const check = await this.userModel.findOne({ email: User.email });
    if (check) {
      throw new CustomException('Email already exists', 400);
    }
    const data = await this.userModel.create(User);
    const token = await this.JwtService.signAsync({
      id: data._id,
      username: data.username,
    });
    return { User: data, token };
  }

  async login(User: Login) {
    const data = await this.userModel.findOne({ email: User.email });
    if (!data) {
      throw new CustomException('email not found', 401);
    }
    const check = await bcrypt.compare(User.password, data.password);
    if (!check) {
      throw new CustomException('password not correct', 401);
    }
    const token = await this.JwtService.signAsync({
      id: data._id,
      username: data.username,
    });
    return { User: data, token };
  }

  async get_user(id: string) {
    const data = await this.userModel.findById(id);
    if (!data) {
      throw new CustomException('user not found', 404);
    }
    return data;
  }

  get_logged_user(data: User) {
    delete data.password;
    return data;
  }

  async update_user(id: string, data: UpdateUser) {
    if (!data) {
      throw new CustomException('please choose data to update', 404);
    }
    const user = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!user) {
      throw new CustomException('user not found', 404);
    }
    return user;
  }

  async change_password(data: ChangePassword, id: string) {
    if (data.password !== data.confirmPassword) {
      throw new CustomException(' incorrect password confirm', 404);
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new CustomException('User not found', 404);
    }

    const isOldPasswordValid = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new CustomException('Old password is incorrect', 401);
    }
    const hashedNewPassword = await bcrypt.hash(data.password, 10);
    await this.userModel.findByIdAndUpdate(id, {
      password: hashedNewPassword,
      passwordChangeAt: new Date(),
    });

    return { message: 'Password changed successfully' };
  }
  async forgot_password(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new CustomException('User not found', 404);
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    user.codeExpire = new Date(Date.now() + 5 * 60 * 1000);
    user.resetCode = code;
    await user.save();
    const context = {
      name: user.username,
      code,
    };
    await this.emailService.send_email(
      email,
      'Yousef Mostafa <imayousefgo@gmail.com>',
      'reset password',
      'reset_password.hbs',
      context,
    );
    return { message: 'reset code has sent to your email' };
  }

  async send_code(data: CodeSend) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new CustomException('User not found', 404);
    }
    if (user.resetCode !== data.code) {
      throw new CustomException('Invalid reset code', 404);
    } else {
      const date = new Date();
      if (user.codeExpire < date) {
        throw new CustomException('code expired', 404);
      }
      user.resetStatus = true;
      await user.save();
      return { message: 'reset code applied successfully ' };
    }
  }

  async reset_password(data: ResetPassword) {
    if (data.password !== data.confirmPassword) {
      throw new CustomException('Invalid password', 404);
    }
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new CustomException('User not found', 404);
    }
    const date = new Date();
    if (user.codeExpire < date) {
      throw new CustomException('code expired', 404);
    }
    if (user.resetStatus !== true) {
      throw new CustomException('invalid reset', 404);
    }
    const password = await bcrypt.hashSync(data.password, 10);
    user.password = password;
    user.passwordChangeAt = new Date();
    user.codeExpire = null;
    user.resetCode = null;
    user.resetStatus = null;
    await user.save();
    return { message: 'reset password changed successfully ' };
  }
}
