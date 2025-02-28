import { PartialType } from '@nestjs/mapped-types';
import CreateTypesDto from './create-type.dto';

export default class UpdateTypeDto extends PartialType(CreateTypesDto) {}
