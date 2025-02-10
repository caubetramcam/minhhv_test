import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './item.service';
import { QueryItemDto } from './dto/query-item.dto';
import { CheckTokenGuard } from 'src/common/guards/check-token.guard';
import { IRequest } from 'src/common/interface/common.interface';
import { plainToInstance } from 'class-transformer';
import { ListItemDto } from './dto/list-item.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
@UseGuards(CheckTokenGuard)
export class ItemController {
  constructor(private readonly itemService: ItemsService) {}

  @Get()
  async findAll(@Query() query: QueryItemDto) {
    console.log(query);
    const { data, total } = await this.itemService.findAll(query);
    return {
      data,
      pagination: {
        total,
        page: +query.page,
        size: +query.size,
        pageCount: Math.ceil(Number(total) / Number(query.size)),
      },
    };
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Req() req: IRequest) {
    return await this.itemService.delete(uuid, req?.user?.username);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return await this.itemService.findOne(uuid);
  }

  @Post()
  async create(@Body() payload: CreateItemDto, @Req() req: IRequest) {
    return await this.itemService.create(payload, req?.user?.username);
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() payload: UpdateItemDto,
    @Req() req: IRequest,
  ) {
    return await this.itemService.update(uuid, payload, req?.user?.username);
  }
}
