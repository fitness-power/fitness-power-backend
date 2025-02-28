import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import SignUp from './sign_up.dto';

export default class ResetPassword extends PickType(SignUp, [
  'confirmPassword',
  'password',
] as const) {
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
