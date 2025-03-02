import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../categories/categories.schema';

export type CatDocument = HydratedDocument<Types>;

@Schema()
export class Types {
  @Prop({ required: true, maxlength: 70 })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, ref: Category.name })
  category: mongoose.Schema.Types.ObjectId;
}

export const TypesSchema = SchemaFactory.createForClass(Types);

TypesSchema.pre('find', function () {
  this.populate('category', '_id title');
});
