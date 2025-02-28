import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart, Cart_document } from './cart.schema';
import CreateCartDto from './dto/create-cart.dto';
import UpdateCartDto from './dto/update-cart.dto';
import { Product, Product_document } from '../product/product.schema';
import ProductDto from './dto/product.dto';
import { CustomException } from 'src/exceptions/custom.exception';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createCartDto: CreateCartDto, userId: string): Promise<Cart> {
    const { products } = createCartDto;
    const productData = await this.productModel.findById(products[0].item);
    if (!productData) {
      throw new NotFoundException(`Product not found`);
    }
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      const totalPrice = await this.calculateTotalPrice(products);
      return await new this.cartModel({
        userId,
        products,
        totalPrice,
      }).save();
    } else {
      const existingProduct = cart.products.find((p) => {
        const item = p.item as any;
        return item._id?.toString() === productData._id.toString();
      });
      if (existingProduct) {
        existingProduct.quantity += products[0].quantity;
      } else {
        cart.products.push(products[0]);
      }
      cart.totalPrice = await this.calculateTotalPrice(cart.products);
      await cart.save();
      return cart;
    }
  }

  async calculateTotalPrice(products: ProductDto[]): Promise<number> {
    let totalPrice = 0;
    for (const product of products) {
      const productData = await this.productModel.findById(product.item);
      totalPrice += productData.price * product.quantity;
    }
    return totalPrice;
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async findOne(
    id: string,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<Cart> {
    const data = await this.cartModel.findById(id).exec();
    if (!data) {
      throw new CustomException('cart not found', 404);
    }
    if (userId.toString() !== data.userId.toString()) {
      throw new CustomException('unauthorized', 401);
    }
    return data;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    cart.products = updateCartDto.products;
    cart.totalPrice = await this.calculateTotalPrice(cart.products);
    return cart.save();
  }

  async remove(id: string, userId: mongoose.Schema.Types.ObjectId) {
    const data = await this.cartModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new CustomException('cart not found', 404);
    }
    if (userId.toString() !== data.userId.toString()) {
      throw new CustomException('unauthorized', 401);
    }
    return { message: 'cart deleted successfully' };
  }

  async removeProduct(
    cartId: string,
    productId: string,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<Cart> {
    const data = await this.cartModel.findById(cartId);
    if (!data) {
      throw new NotFoundException(`Cart not found`);
    }
    if (userId.toString() !== data.userId.toString()) {
      throw new CustomException('unauthorized', 401);
    }
    data.products = data.products.filter((p) => {
      const item = p.item as any;
      return item._id?.toString() !== productId;
    });
    data.totalPrice = await this.calculateTotalPrice(data.products);
    return data.save();
  }

  async updateQuantity(
    cartId: string,
    productId: string,
    quantity: number,
    userId: mongoose.Schema.Types.ObjectId,
  ): Promise<Cart> {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }
    if (userId.toString() !== cart.userId.toString()) {
      throw new CustomException('unauthorized', 401);
    }
    const product = cart.products.find((p) => {
      const item = p.item as any;
      return item._id?.toString() === productId;
    });
    if (!product) {
      throw new CustomException(
        `Product with ID ${productId} not found in cart`,
        404,
      );
    }

    product.quantity = quantity;
    cart.totalPrice = await this.calculateTotalPrice(cart.products);
    return cart.save();
  }
}
