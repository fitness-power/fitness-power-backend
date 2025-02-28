import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export default class CreateCategoryDto {
  @Expose()
  @IsNotEmpty({ message: 'Please provide a title' })
  @IsString({ message: 'Please provide a valid title' })
  @MaxLength(70, { message: 'title max characters is 70' })
  title: string;

  @Expose()
  image: string;
}
