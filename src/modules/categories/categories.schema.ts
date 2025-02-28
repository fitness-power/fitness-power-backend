import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true, maxlength: 70 })
  title: string;

  @Prop({ required: true })
  image: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Category);
