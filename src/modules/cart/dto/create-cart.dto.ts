import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ProductDto from './product.dto';

export default class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
