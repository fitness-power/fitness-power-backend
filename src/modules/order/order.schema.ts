import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from '../product/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  paymentType: string;

  @Prop({ required: true, default: false })
  isDelivered: boolean;

  @Prop({ required: true, default: false })
  isPaid: boolean;

  @Prop()
  paymentMethodId?: string;

  @Prop()
  paymentIntentId?: string;

  @Prop({ required: true })
  amount: number;

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
}

export const OrderSchema = SchemaFactory.createForClass(Order);
