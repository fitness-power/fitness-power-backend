import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './cart.schema';
import { Product, Product_schema } from '../product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: Product_schema }]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
