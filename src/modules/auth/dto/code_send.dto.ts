import { IsNotEmpty } from 'class-validator';

export default class CodeSend {
  @IsNotEmpty({ message: 'email is required' })
  email: string;
  @IsNotEmpty({ message: 'code is required' })
  code: string | number;
}
