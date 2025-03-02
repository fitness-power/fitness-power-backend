import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Types } from '../types/types.schema';

export type Product_document = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true, minlength: 6, maxlength: 100 })
  title: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  nv: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  image: string;

  @Prop({ ref: Types.name, required: true })
  type: mongoose.Schema.Types.ObjectId;
}

export const Product_schema = SchemaFactory.createForClass(Product);

Product_schema.pre('find', function () {
  this.populate('type', 'title');
});

Product_schema.pre('findOne', function () {
  this.populate('type', 'title');
});
