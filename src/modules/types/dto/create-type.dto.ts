import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';

export default class CreateTypesDto {
  @Expose()
  @IsNotEmpty({ message: 'type title must not be empty' })
  @MaxLength(70, { message: 'title max characters is 70' })
  title: string;
  @Expose()
  image: string;
  @Expose()
  @IsNotEmpty({ message: 'type title must not be empty' })
  @IsMongoId({ message: 'this is not a valid Mongo id' })
  category: string;
}
