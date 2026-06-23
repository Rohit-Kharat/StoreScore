import { IsEmail, IsNotEmpty, Length, MaxLength, IsOptional, IsInt } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty({ message: 'Store Name is required.' })
  @Length(20, 60, { message: 'Store Name must be between 20 and 60 characters.' })
  name: string;

  @IsNotEmpty({ message: 'Store Email is required.' })
  @IsEmail({}, { message: 'Must follow standard email validation rules.' })
  email: string;

  @IsNotEmpty({ message: 'Store Address is required.' })
  @MaxLength(400, { message: 'Store Address must be maximum 400 characters.' })
  address: string;

  @IsOptional()
  @IsInt({ message: 'Owner ID must be an integer.' })
  ownerId?: number;
}
