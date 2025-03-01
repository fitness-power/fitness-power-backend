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
import { TypesService } from './types.service';
import CreateTypesDto from './dto/create-type.dto';
import UpdateTypesDto from './dto/update-type.dto';
import { File } from 'src/decorator/file.decorator';
import errors from 'src/validations/file.validation';
import { plainToInstance } from 'class-transformer';
import IdParamDto from 'src/validations/id-param.dto';
@Controller('types')
@UseGuards(AuthGuard)
export class TypesController {
  constructor(private readonly TypesService: TypesService) {}
  @Roles('admin')
  @Post()
  async create(@Req() req: Request, @File() buffer: Buffer) {
    console.log(req.body);
    const data = plainToInstance(CreateTypesDto, req.body, {
      excludeExtraneousValues: true,
    });
    await errors(data);
    return this.TypesService.create(data, buffer);
  }
  @Public()
  @Get()
  findAll() {
    return this.TypesService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param() Param: IdParamDto) {
    return this.TypesService.findOne(Param.id);
  }
  @Public()
  @Get('category/:id')
  findByCategory(@Param('id') category: string) {
    return this.TypesService.findByCategory(category);
  }
  @Roles('admin')
  @Put(':id')
  async update(
    @Req() req: Request,
    @File() buffer: Buffer,
    @Param() Param: IdParamDto,
  ) {
    const data = plainToInstance(UpdateTypesDto, req.body, {
      excludeExtraneousValues: true,
    });
    await errors(data);
    return this.TypesService.update(Param.id, data, buffer);
  }
  @Roles('admin')
  @Delete(':id')
  remove(@Param() Param: IdParamDto) {
    return this.TypesService.remove(Param.id);
  }
}
