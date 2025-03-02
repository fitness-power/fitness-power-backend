import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
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

  @Get('user')
  findOne(@user('_id') userId: mongoose.Schema.Types.ObjectId) {
    return this.cartService.findOne(userId);
  }
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete()
  remove(@user('_id') userId: mongoose.Schema.Types.ObjectId) {
    return this.cartService.remove(userId);
  }
  @Delete('/product/:productId')
  removeProduct(
    @Param('productId') productId: string,
    @user('_id') userId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.cartService.removeProduct(productId, userId);
  }

  @Put('quantity/:productId/')
  updateQuantity(
    @Param('productId') productId: string,
    @user('_id') userId: mongoose.Schema.Types.ObjectId,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(productId, quantity, userId);
  }
}
