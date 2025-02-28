import { OmitType, PartialType } from '@nestjs/mapped-types';
import SignUp from './sign_up.dto';

export default class UpdateUser extends PartialType(
  OmitType(SignUp, ['confirmPassword', 'password', 'role'] as const),
) {
  image: string;
}
