import { IsEmail, IsNotEmpty, Length, MaxLength, Matches } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters.' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must follow standard email validation rules.' })
  email: string;

  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(400, { message: 'Address must be maximum 400 characters.' })
  address: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 16, { message: 'Password must be between 8 and 16 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must include at least one uppercase letter and one special character.',
  })
  password: string;
}
