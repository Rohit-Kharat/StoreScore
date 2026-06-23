import { IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Current password is required.' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required.' })
  @Length(8, 16, { message: 'New password must be between 8 and 16 characters.' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'New password must include at least one uppercase letter and one special character.',
  })
  newPassword: string;
}
