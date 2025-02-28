import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Types, TypesSchema } from './types.schema';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Types.name, schema: TypesSchema }]),
  ],
  controllers: [TypesController],
  providers: [TypesService, CloudinaryService],
})
export class TypesModule {}
