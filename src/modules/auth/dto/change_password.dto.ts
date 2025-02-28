import { PickType } from '@nestjs/mapped-types';
import SignUp from './sign_up.dto';
import { IsNotEmpty } from 'class-validator';

export default class ChangePassword extends PickType(SignUp, [
  'confirmPassword',
  'password',
] as const) {
  @IsNotEmpty({ message: 'old password is required' })
  oldPassword: string;
}
