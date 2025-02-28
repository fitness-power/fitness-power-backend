import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCashOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

