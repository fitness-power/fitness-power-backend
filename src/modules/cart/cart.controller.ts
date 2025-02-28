import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import CreateCartDto from './dto/create-cart.dto';
import UpdateCartDto from './dto/update-cart.dto';
import user from 'src/decorator/user.decorator';
import { Roles } from 'src/decorator/role.decorator';
import mongoose from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @user('_id') userId: string) {
    return this.cartService.create(createCartDto, userId);
  }
  @Roles('admin')
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @user('_id') userId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.cartService.findOne(id, userId);
  }
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @user('_id') userId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.cartService.remove(id, userId);
  }
  @Delete(':cartId/product/:productId')
  removeProduct(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @user('_id') userId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.cartService.removeProduct(cartId, productId, userId);
  }

  @Patch(':cartId/product/:productId/quantity')
  updateQuantity(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @user('_id') userId: mongoose.Schema.Types.ObjectId,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(cartId, productId, quantity, userId);
  }
}
