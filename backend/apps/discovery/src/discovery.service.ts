import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '@core/database/entities/item.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { from, Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DiscoveryService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async discoverPipeline(id: number) {
    const itemExist = await this.checkIfItemExist(id);
    if (!itemExist) {
      const { data } = await this.getItemFromAPI(id);

      const newItem = this.itemRepository.create();
      newItem.id = id;
      newItem.item = data;
      newItem.name = data.name.en_US;
      await this.itemRepository.save(newItem);
    }
  }

  async getItemFromAPI(id: number): Promise<AxiosResponse<any>> {
    const itemWowURL = `${this.configService
      .get('API_URL')
      .replace('{region}', 'eu')}/item/${id}`;

    Logger.debug('API URL: ' + itemWowURL);

    const callQueryString = new URLSearchParams({
      namespace: 'static-eu',
      local: 'en_US',
      access_token: this.configService.get('TOKEN'),
    });

    return this.http
      .get(itemWowURL + '?' + callQueryString.toString())
      .toPromise();
  }

  async checkIfItemExist(id: number): Promise<boolean> {
    const item = await this.itemRepository.findOne(id);
    return typeof item !== 'undefined';
  }
}
