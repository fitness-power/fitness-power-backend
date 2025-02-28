import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorator/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorator/public.decorator';
import { CategoriesService } from './categories.service';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { File } from 'src/decorator/file.decorator';
import errors from 'src/validations/file.validation';
import { plainToInstance } from 'class-transformer';
import IdParamDto from 'src/validations/id-param.dto';
@Controller('categories')
export class CategoryController {
  constructor(private readonly CategoriesService: CategoriesService) {}
  @Roles('admin')
  @Post()
  async create(@Req() req: Request, @File() buffer: Buffer) {
    const data = plainToInstance(CreateCategoryDto, req.body, {
      excludeExtraneousValues: true,
    });
    await errors(data);
    return this.CategoriesService.create(data, buffer);
  }
  @Public()
  @Get()
  findAll() {
    return this.CategoriesService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param() Param: IdParamDto) {
    return this.CategoriesService.findOne(Param.id);
  }
  @Roles('admin')
  @Put(':id')
  async update(
    @Req() req: Request,
    @File() buffer: Buffer,
    @Param() Param: IdParamDto,
  ) {
    const data = plainToInstance(UpdateCategoryDto, req.body, {
      excludeExtraneousValues: true,
    });
    await errors(data);
    return this.CategoriesService.update(Param.id, data, buffer);
  }
  @Roles('admin')
  @Delete(':id')
  remove(@Param() Param: IdParamDto) {
    return this.CategoriesService.remove(Param.id);
  }
}
