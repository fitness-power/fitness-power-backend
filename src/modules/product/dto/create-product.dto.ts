import { Expose } from 'class-transformer';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export default class CreateProductDto {
  @Expose()
  @IsNotEmpty({ message: 'Product title is required' })
  title: string;
  @Expose()
  @IsNotEmpty({ message: 'Product brand link is required' })
  brand: string;
  @Expose()
  @IsNotEmpty({ message: 'Product Nutritional value is required' })
  nv: number;
  @Expose()
  @IsNotEmpty({ message: 'Product type is required' })
  type: string;
  @Expose()
  @IsNotEmpty({ message: 'Product price is required' })
  price: number;
  @Expose()
  image: string;
}
