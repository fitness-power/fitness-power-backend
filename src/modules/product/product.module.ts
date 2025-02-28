import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, Product_schema } from './Product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: Product_schema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
})
export class ProductModule {}
