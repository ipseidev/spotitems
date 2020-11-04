import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { WowApiService } from '../wow-api/wow-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '@core/database/entities/auction.entity';
import { Repository } from 'typeorm';
import { User } from '@core/database/entities/user.entity';
import {
  concatMap,
  delay,
  filter,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { compareAuctionWithRules } from './operatorsFunction/operatorsFunctions';
import * as _ from 'lodash';
import { ClientProxy } from '@nestjs/microservices';
import * as pqueue from 'p-queue';

@Injectable()
export class ScannerService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly wowApi: WowApiService,
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('DISCOVERY') private readonly discoveryClient: ClientProxy,
  ) {}

  /**
   * Méthode principale qui permet de scanner les hotels des ventes
   * de chaque serveur et de comparer les ventes avec les règles définies par les utilisateur
   * si une vente correspond a N règles d'utilisateur, cette vente est sauvegardé
   */
  public async scan() {
    Logger.log('Début du scan....');
    const users = await this.userRepository.find();
    Logger.debug(users);
    const realms = await this.wowApi.getConnectedRealm();
    const Urls = this.buildCallUrl(realms);
    const resultPromise = this.buildFetchPromise(Urls);
    const queue = new pqueue.default({ concurrency: 3, autoStart: true });

    resultPromise.forEach(p => {
      queue.add(async () => {
        Logger.debug('Hello wow api');
        const data = await p;
        const auctionToSave = data.data.auctions
          .map(auction => {
            const newAuction = this.mapAuctionByUser(auction, users);
            if (newAuction.users.length > 0) {
              return newAuction;
            }
            return;
          })
          .filter(auction => auction);

        for (const auction of auctionToSave) {
          await this.saveAuctions(auction);
          this.discoveryClient.emit('new_item', auction);
        }
      });
    });

    /*resultPromise.forEach((p, i) => {
      Logger.debug('Hello promise ' + i);
      setTimeout(async () => {
        Logger.debug('Hello wow api');
        const { data } = await p;
        Logger.debug(data.length);
        const auctionToSave = data
          .map(auction => {
            const newAuction = this.mapAuctionByUser(auction, users);
            if (newAuction.users.length > 0) {
              return newAuction;
            }
            return;
          })
          .filter(auction => auction);

        for (const auction of auctionToSave) {
          await this.saveAuctions(auction);
        }
      }, i * 60000);
    });
*/
    /*resultObservable.forEach(realm => {
      realm.subscribe({
        next: response =>
          from(response.data.auctions)
            .pipe(
              take(50),
              tap(auctions => Logger.debug(auctions, 'ScannerService', false)),
              switchMap(auction => {
                const newAuction = this.mapAuctionByUser(auction, users);
                if (newAuction.users.length > 0) {
                  return newAuction;
                }
                return;
              }),
              filter(auction => typeof auction !== 'undefined'),
            )
            .subscribe(async auction => {
              Logger.log(auction);
              await this.saveAuctions(auction);
              this.discoveryClient.emit('new_item', auction);
            }),
        error: err => Logger.error(err),
      });
    });*/
  }

  /**
   * Retourne les auctions avec un tableau d'utilisateurs intéressés par la vente.
   * Cela permettra de faire des recherches plus simple des ventes dans la base
   *
   * TODO: Utilisé un uuid dans les règles, pour pouvoir les metres dans les ventes
   * ça permettrait de dire a un utilisateur quelles règles a déclenché la notification
   *
   * @param auction
   * @param users
   * @private
   */
  private mapAuctionByUser(auction: any, users: User[]): any {
    let newAuction = { ...auction, users: [] };
    users.map(user => {
      const isInterestedByAuction = user.profile.auction_rules.some(rule =>
        compareAuctionWithRules(auction, rule),
      );

      if (isInterestedByAuction) {
        newAuction = { ...auction, users: [...newAuction.users, user.id] };
      }
    });
    // retourne l'auction avec un tableau d'id utilisateurr unique
    return { ...newAuction, users: _.uniq<number>(newAuction.users) };
  }

  private async saveAuctions(auction: any) {
    return this.auctionRepository.insert({ auction });
  }

  /**
   * Créé des observables de response axios pour pouvoir les traiter tout en libérant la méthode
   * de scan (sans await)
   *
   * @param Urls
   * @private
   */
  private buildFetchPromise(Urls: string[]): Promise<AxiosResponse>[] {
    return Urls.map(url => this.http.get(url).toPromise());
  }

  /**
   * Retourne les urls que doit appeler le jobs
   *
   * @param realms
   * @private
   */
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
