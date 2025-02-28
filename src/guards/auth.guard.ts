import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomException } from 'src/exceptions/custom.exception';
import { User } from 'src/modules/auth/auth.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly reflector: Reflector,
    private readonly JwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ISpublic: boolean = this.reflector.get(
      'public',
      context.getHandler(),
    );
    if (ISpublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new CustomException('please login first', 401);
    }
    const user = await this.validateToken(token);
    request.user = user;
    this.checkRoles(context, request);
    this.checkSetId(context, request);
    return true;
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const token_data = await this.JwtService.verifyAsync(token.split(' ')[1]);
      if (!token_data) {
        throw new CustomException('user not found', 401);
      }
      const user = await this.userModel.findById(token_data.id);
      if (!user) {
        throw new CustomException('user not found', 401);
      }
      const time = new Date(token_data.iat * 1000);
      const update = user?.passwordChangeAt;
      if (time < update) {
        throw new CustomException('password change please login again ', 401);
      }
      return user;
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new CustomException('token expired', 401);
      }
      if (error.message === 'jwt malformed') {
        throw new CustomException('invalid token', 401);
      }
      throw new CustomException('invalid token', 401);
    }
  }

  private checkRoles(context: ExecutionContext, request: any): void {
    const roles: string[] = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return;
    }
    if (!roles.includes(request.user.role)) {
      throw new CustomException('unauthorized', 401);
    }
  }

  private checkSetId(context: ExecutionContext, request: any): void {
    const set_id: boolean = this.reflector.get('set_id', context.getHandler());
    if (set_id) {
      if (request.user.role !== 'admin') {
        if (request.user._id !== request.body.user) {
          throw new CustomException('unauthorized', 401);
        }
      }
    }
  }
}
