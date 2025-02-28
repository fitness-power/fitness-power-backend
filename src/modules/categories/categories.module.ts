import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategoriesSchema } from './categories.schema';
import { CategoryController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategoriesSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoriesService, CloudinaryService],
})
export class CategoryModule {}
