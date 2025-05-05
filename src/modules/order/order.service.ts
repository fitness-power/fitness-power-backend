import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { Order } from "./order.schema";
import { Cart } from "../cart/cart.schema";
import { CustomException } from "../../exceptions/custom.exception";
import { StripeService } from "./stripe.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly stripeService: StripeService
  ) {}

  async createCashOrder(userId: string, cartId: string): Promise<Order> {
    if (!isValidObjectId(cartId)) {
      throw new CustomException("Invalid cart ID", 400);
    }
    const cart = await this.cartModel.findOne({ _id: cartId, userId }).exec();
    if (!cart) {
      throw new CustomException("Cart not found", 404);
    }

    const createdOrder = new this.orderModel({
      userId,
      amount: cart.totalPrice.toFixed(2),
      products: cart.products,
      paymentType: "cash",
      isDelivered: false,
      isPaid: false,
    });
    await cart.deleteOne();
    return createdOrder.save();
  }

  async createCardOrderSession(
    userId: string,
    cartId: string,
    origin: string
  ): Promise<string> {
    if (!isValidObjectId(cartId)) {
      throw new CustomException("Invalid cart ID", 400);
    }
    const cart = await this.cartModel.findOne({ _id: cartId, userId }).exec();
    if (!cart) {
      throw new CustomException("Cart not found", 404);
    }
    return this.stripeService.createCheckoutSession(
      userId,
      cart.products,
      cart.totalPrice,
      origin
    );
  }

  async handleStripeWebhook(body: any, sig: any): Promise<Order> {
    const { userId, totalPrice, products } =
      await this.stripeService.handleWebhook(body, sig);
    const createdOrder = new this.orderModel({
      userId,
      amount: totalPrice,
      products,
      paymentType: "card",
      isDelivered: false,
      isPaid: true,
    });
    await this.cartModel.deleteOne({ userId });
    return createdOrder.save();
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId })
      .populate({ path: "userId", select: "username email phone address" })
      .populate({
        path: "products.item",
        select: "-type -image -__v",
      });
  }

  async deleteOrder(orderId: string): Promise<void> {
    if (!isValidObjectId(orderId)) {
      throw new CustomException("Invalid order ID", 400);
    }
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    await this.orderModel.deleteOne({ _id: orderId });
  }

  async setOrderPaid(orderId: string): Promise<Order> {
    if (!isValidObjectId(orderId)) {
      throw new CustomException("Invalid order ID", 400);
    }
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    order.isPaid = true;
    return order.save();
  }

  async setOrderDelivered(orderId: string): Promise<Order> {
    if (!isValidObjectId(orderId)) {
      throw new CustomException("Invalid order ID", 400);
    }
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    order.isDelivered = true;
    return order.save();
  }
}
