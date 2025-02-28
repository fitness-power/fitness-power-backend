import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

class Login {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @MaxLength(255, { message: 'Email must be at most 255 characters long' })
  @MinLength(5, { message: 'Email must be at least 5 characters long' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
export default Login;
