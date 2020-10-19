import { HttpService, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { debounceTime, filter, switchMap, take } from 'rxjs/operators';
import { WowApiService } from '../wow-api/wow-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../database/entities/auction.entity';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ScannerService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly wowApi: WowApiService,
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
  }

  /**
   * Méthode principale qui permet de scanner les hotels des ventes
   * de chaque serveur
   */
  public async scan() {
    const users = await this.userRepository.find();
    const realms = await this.wowApi.getConnectedRealm();

    const Urls = this.buildCallUrl(realms);
    const resultObservable = this.buildFetchPromise(Urls);
    /**
     * TODO: Faire le traitement des auctions
     */
    resultObservable.forEach(realm => {
      realm.subscribe({
        next: response =>
          from(response.data.auctions)
            .pipe(
              switchMap(async auction => await this.auctionFilter(auction, users) ? auction : undefined),
              filter(auction => typeof auction !== 'undefined'),
              debounceTime(20),
            )
            .subscribe(async auction => await this.saveAuctions(auction)),
        error: err => Logger.error(err),
      });
    });
  }

  private async auctionFilter(auction: any, users: User[]): Promise<boolean> {


    const operatorFunctions = {
      'eq': (auction, type, value) => auction[type] === value,
      'gt': (auction, type, value) => auction[type] > value,
    };

    return users[0].profile.auction_rules.reduce((acc, current) => {
      Logger.log(auction.buyout);
      return operatorFunctions[current.operator](auction, current.type, current.value);
    }, false);


    /**
     * TODO: Faire le filtre des paramètres
     */
  }

  private async saveAuctions(auction: any) {
    return this.auctionRepository.insert({ auction });
  }

  private buildFetchPromise(Urls: string[]): Observable<AxiosResponse<any>>[] {
    return Urls.map(url => this.http.get(url));
  }

  private buildCallUrl(realms: string[]): string[] {
    return realms.map(realm => {
      const searchParam = new URLSearchParams({
        locale: 'fr_FR',
        region: 'eu',
        namespace: 'dynamic-eu',
        access_token: this.config.get('TOKEN'),
      });

      return `${this.config
        .get('EU_URL')
        .replace('{id}', realm)}?${searchParam.toString()}`;
    });
  }
}
