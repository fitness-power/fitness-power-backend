import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './categories.schema';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-Category.dto';
import { CustomException } from 'src/exceptions/custom.exception';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: Model<Category>,
    private readonly CloudinaryService: CloudinaryService,
  ) {}
  async findAll(): Promise<Category[]> {
    return this.CategoryModel.find().exec();
  }

  async create(data: CreateCategoryDto, buffer: Buffer): Promise<Category> {
    if (!buffer) {
      throw new CustomException('Category image not found', 404);
    }
    const img = await this.CloudinaryService.upload_image(buffer, 'Category');
    data.image = img;
    const Category = new this.CategoryModel(data);
    return Category.save();
  }

  async findOne(id: string): Promise<Category> {
    const Category = await this.CategoryModel.findById(id);
    if (!Category) {
      throw new CustomException('Category not found', 404);
    }
    return Category;
  }

  async update(
    id: string,
    data: UpdateCategoryDto,
    buffer: Buffer,
  ): Promise<Category> {
    if (!data) {
      throw new CustomException('please choose data to update', 404);
    }
    const Category = await this.CategoryModel.findById(id);
    if (buffer) {
      const public_id = Category.image.split('/')[9].replace('.png', '');
      const image = await this.CloudinaryService.replaceImage(
        public_id,
        'Category',
        buffer,
      );
      Category.image = image;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) Category[key] = data[key];
    });
    await Category.save();
    if (!Category) {
      throw new CustomException('Category not found', 404);
    }
    return Category;
  }

  async remove(id: string) {
    const Category = await this.CategoryModel.findByIdAndDelete(id);
    if (!Category) {
      throw new CustomException('Category not found', 404);
    }
    const url = Category.image.split('/');
    const public_id = `${url[url.length - 3]}/${url[url.length - 2]}/${url[url.length - 1].replace('.png', '')}`;
    await this.CloudinaryService.delete_image(public_id);
    return { message: 'Category deleted successfully' };
  }
}
