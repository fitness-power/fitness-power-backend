import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import CreateProductDto from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { Public } from 'src/decorator/public.decorator';
import { Roles } from 'src/decorator/role.decorator';
import { File } from 'src/decorator/file.decorator';
import { plainToInstance } from 'class-transformer';
import { CustomException } from 'src/exceptions/custom.exception';
import errors from 'src/validations/file.validation';
import IdParamDto from 'src/validations/id-param.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}
  @Roles('admin')
  @Post()
  async create(@Req() req: Request, @File() file: Buffer) {
    if (!file) throw new CustomException('File not found', 404);
    const data = plainToInstance(CreateProductDto, req.body);
    await errors(data);
    return this.ProductService.create(data, file);
  }
  @Public()
  @Get()
  findAll(
    @Query()
    query: {
      title?: string;
      minPrice?: number;
      maxPrice?: number;
      type?: string;
    },
  ) {
    return this.ProductService.findAll(query);
  }
  @Public()
  @Get(':id')
  findOne(@Param() Param: IdParamDto) {
    return this.ProductService.findOne(Param.id);
  }
  @Roles('admin')
  @Put(':id')
  async update(
    @Param() Param: IdParamDto,
    @Req() req: Request,
    @File() file: Buffer,
  ) {
    const data = plainToInstance(UpdateProductDto, req.body, {
      excludeExtraneousValues: true,
    });
    await errors(data);
    return this.ProductService.update(Param.id, data, file);
  }
  @Roles('admin')
  @Delete(':id')
  remove(@Param() Param: IdParamDto) {
    return this.ProductService.remove(Param.id);
  }
}
