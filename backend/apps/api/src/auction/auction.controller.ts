import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(createAuctionDto);
  }

  @Get()
  findAll(@Query('users_id') users_id: string | string[]) {
    const searchedUserId = Array.isArray(users_id)
      ? users_id.map(id => +id)
      : [+users_id];

    return this.auctionService.findByUserIds(searchedUserId);
  }

  @Get(':id')
  findOne(@Param('user_id') user_id: string) {
    return this.auctionService.findOne(+user_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionService.update(+id, updateAuctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionService.remove(+id);
  }
}
