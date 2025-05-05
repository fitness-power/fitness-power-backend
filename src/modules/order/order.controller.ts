import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { user } from "../../decorator/user.decorator";
import { FastifyRequest } from "fastify";
import { Public } from "src/decorator/public.decorator";
import { Roles } from "src/decorator/role.decorator";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("cash/:cartId")
  async createCashOrder(
    @user("_id") userId: string,
    @Param("cartId") cartId: string
  ) {
    return this.orderService.createCashOrder(userId, cartId);
  }

  @Post("card/:cartId")
  async createCardOrderSession(
    @user("id") userId: string,
    @Param("cartId") cartId: string,
    @Req() req: FastifyRequest
  ) {
    const originUrl =
      req.headers.origin || req.headers.referer || "http://localhost:3000";
    return this.orderService.createCardOrderSession(userId, cartId, originUrl);
  }
  @Public()
  @Post("webhook")
  async handleStripeWebhook(@Req() req: FastifyRequest) {
    const event = req.body;
    const sig = req.headers["stripe-signature"];
    return this.orderService.handleStripeWebhook(event, sig);
  }

  @Get()
  @Roles("admin")
  async getOrders(@user("_id") userId: string) {
    return this.orderService.getOrders(userId);
  }

  @Delete(":id")
  @Roles("admin")
  async deleteOrder(
    @Param("id") orderId: string
  ): Promise<{ message: string }> {
    await this.orderService.deleteOrder(orderId);
    return { message: "Order deleted successfully" };
  }

  @Post(":id/paid")
  @Roles("admin")
  async setOrderPaid(@Param("id") orderId: string) {
    return this.orderService.setOrderPaid(orderId);
  }

  @Post(":id/delivered")
  @Roles("admin")
  async setOrderDelivered(@Param("id") orderId: string) {
    return this.orderService.setOrderDelivered(orderId);
  }
}
