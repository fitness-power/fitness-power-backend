import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../auth/auth.schema';
import { Product } from '../product/product.schema';

export type Cart_document = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({ required: true, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    _id: false,
  })
  products: { item: mongoose.Schema.Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('findOne', function () {
  this.populate({
    path: 'products.item',
    select: '_id title price image',
  });
});
