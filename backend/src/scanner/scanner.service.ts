import { forwardRef, HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { WowApiService } from '../wow-api/wow-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../database/entities/auction.entity';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { JobsService } from '../jobs/jobs.service';
import { filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class ScannerService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly wowApi: WowApiService,
    private readonly  jobs: JobsService,
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

    resultObservable.forEach(realm => {
      realm.subscribe({
        next: response =>
          from(response.data.auctions)
            .pipe(
              take(5),
              switchMap(async auction => await this.auctionFilter(auction, users) ? auction : undefined),
              filter(auction => typeof auction !== 'undefined'),
            )
            .subscribe(async auction => {
              Logger.log(auction);
              await this.saveAuctions(auction);
            }),
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
      return operatorFunctions[current.operator](auction, current.type, current.value);
    }, false);

  }

  private async saveAuctions(auction: any) {
    return this.auctionRepository.insert({ auction });
  }

  private buildFetchPromise(Urls: string[]): Observable<AxiosResponse>[] {
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
