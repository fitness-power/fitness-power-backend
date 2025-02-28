import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateTypesDto from './dto/create-type.dto';
import UpdateTypesDto from './dto/update-type.dto';
import { CustomException } from 'src/exceptions/custom.exception';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Types } from './types.schema';

@Injectable()
export class TypesService {
  constructor(
    @InjectModel(Types.name)
    private readonly TypesModel: Model<Types>,
    private readonly CloudinaryService: CloudinaryService,
  ) {}
  async findAll(): Promise<Types[]> {
    return this.TypesModel.find().exec();
  }

  async create(data: CreateTypesDto, buffer: Buffer): Promise<Types> {
    if (!buffer) {
      throw new CustomException('Types image not found', 404);
    }
    const img = await this.CloudinaryService.upload_image(buffer, 'Types');
    data.image = img;
    const Types = new this.TypesModel(data);
    return Types.save();
  }

  async findOne(id: string): Promise<Types> {
    const Types = await this.TypesModel.findById(id);
    if (!Types) {
      throw new CustomException('Types not found', 404);
    }
    return Types;
  }

  async update(
    id: string,
    data: UpdateTypesDto,
    buffer: Buffer,
  ): Promise<Types> {
    if (!data) {
      throw new CustomException('please choose data to update', 404);
    }
    const Types = await this.TypesModel.findById(id);
    if (buffer) {
      const public_id = Types.image.split('/')[9].replace('.png', '');
      const image = await this.CloudinaryService.replaceImage(
        public_id,
        'Types',
        buffer,
      );
      Types.image = image;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) Types[key] = data[key];
    });
    await Types.save();
    if (!Types) {
      throw new CustomException('Types not found', 404);
    }
    return Types;
  }

  async remove(id: string) {
    const Types = await this.TypesModel.findByIdAndDelete(id);
    if (!Types) {
      throw new CustomException('Types not found', 404);
    }
    const url = Types.image.split('/');
    const public_id = `${url[url.length - 3]}/${url[url.length - 2]}/${url[url.length - 1].replace('.png', '')}`;
    await this.CloudinaryService.delete_image(public_id);
    return { message: 'Types deleted successfully' };
  }
}
