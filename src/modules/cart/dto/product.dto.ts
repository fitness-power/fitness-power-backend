import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export default class ProductDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsMongoId({ message: 'invalid Product ID' })
  item: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;
}
