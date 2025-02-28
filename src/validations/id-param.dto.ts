import { IsMongoId, IsNotEmpty } from 'class-validator';

export default class IdParamDto {
  @IsNotEmpty({ message: 'Please provide a valid id' })
  @IsMongoId({ message: 'id not a mongo id' })
  id: string;
}
