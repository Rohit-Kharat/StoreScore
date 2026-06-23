import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must follow standard email validation rules.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
