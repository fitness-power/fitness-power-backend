import { Injectable } from '@nestjs/common';
import CreateProductDto from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CustomException } from 'src/exceptions/custom.exception';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,
    private readonly CloudinaryService: CloudinaryService,
  ) {}
  async create(createProduct: CreateProductDto, buffer: Buffer) {
    const image = await this.CloudinaryService.upload_image(buffer, 'Product');
    createProduct.image = image;
    const data = await this.ProductModel.create(createProduct);
    return data;
  }

  async findAll(query: {
    title?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
  }) {
    const filter: any = {};
    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }
    if (query.minPrice) {
      filter.price = { ...filter.price, $gte: query.minPrice };
    }
    if (query.maxPrice) {
      filter.price = { ...filter.price, $lte: query.maxPrice };
    }
    if (query.type) {
      filter.type = query.type;
    }
    return await this.ProductModel.find(filter).exec();
  }

  async findOne(id: string) {
    const data = await this.ProductModel.findById(id);
    if (!data) {
      throw new CustomException('Product not found', 404);
    }
    return data;
  }

  async update(id: string, updateProduct: UpdateProductDto, buffer: Buffer) {
    if (!updateProduct) {
      throw new CustomException('please choose data to update', 404);
    }
    const data = await this.ProductModel.findById(id);
    if (buffer) {
      const public_id = data.image.split('/')[9].replace('.png', '');
      const image = await this.CloudinaryService.replaceImage(
        public_id,
        'Product',
        buffer,
      );
      updateProduct.image = image;
    }
    Object.keys(updateProduct).forEach((key) => {
      if (updateProduct[key] !== undefined) data[key] = updateProduct[key];
    });
    await data.save();
    if (!data) {
      throw new CustomException('Product not found', 404);
    }
    return data;
  }

  async remove(id: string) {
    const data = await this.ProductModel.findByIdAndDelete(id);
    if (!data) {
      throw new CustomException('Product not found', 404);
    }
    const url = data.image.split('/');
    const public_id = `${url[url.length - 3]}/${url[url.length - 2]}/${url[url.length - 1].replace('.png', '')}`;
    await this.CloudinaryService.delete_image(public_id);
    return { message: 'Product deleted successfully' };
  }
}
