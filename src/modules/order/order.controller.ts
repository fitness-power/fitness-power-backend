import { Controller, Post, Body, Param, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { user } from '../../decorator/user.decorator';
import { FastifyRequest } from 'fastify';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('cash/:cartId')
  async createCashOrder(
    @user('_id') userId: string,
    @Param('cartId') cartId: string,
  ) {
    return this.orderService.createCashOrder(userId, cartId);
  }

  @Post('card/:cartId')
  async createCardOrderSession(
    @user('id') userId: string,
    @Param('cartId') cartId: string,
    @Req() req: FastifyRequest,
  ) {
    const originUrl =
      req.headers.origin || req.headers.referer || 'http://localhost:3000';
    return this.orderService.createCardOrderSession(userId, cartId, originUrl);
  }

  @Post('webhook')
  async handleStripeWebhook(@Req() req: FastifyRequest) {
    const event = req.body;
    const sig = req.headers['stripe-signature'];
    return this.orderService.handleStripeWebhook(event, sig);
  }
}
