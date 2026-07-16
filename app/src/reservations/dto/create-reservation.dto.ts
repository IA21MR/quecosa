import { IsString, IsEmail, IsDateString, IsOptional, MaxLength } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  requestedFor: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
