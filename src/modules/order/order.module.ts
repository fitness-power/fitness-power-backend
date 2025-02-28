import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './order.schema';
import { Cart, CartSchema } from '../cart/cart.schema';
import { StripeService } from './stripe.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ConfigModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
  exports: [OrderService],
})
export class OrderModule {}
