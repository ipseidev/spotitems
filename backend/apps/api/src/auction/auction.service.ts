import { Injectable, Logger } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '@core/database/entities/auction.entity';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  create(createAuctionDto: CreateAuctionDto) {
    return 'This action adds a new auction';
  }

  /**
   * Retourne les ventes qui correspond aux users_id passés
   * @param users_id
   */
  findByUserIds(users_id: number[]) {
    return getConnection()
      .createQueryBuilder()
      .select('"A".auction', 'item')
      .from(subQuery => {
        return subQuery
          .select('*')
          .addSelect("auction.auction -> 'users'", 'users')
          .from('auction', 'auction');
      }, 'A')
      .where(`"A".users::jsonb @> '${JSON.stringify(users_id)}'`)
      .getRawMany();
  }

  findOne(users_id: number | number[]) {}

  update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a #${id} auction`;
  }

  remove(id: number) {
    return `This action removes a #${id} auction`;
  }
}
