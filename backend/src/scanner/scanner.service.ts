import { HttpService, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { take } from 'rxjs/operators';
import { WowApiService } from '../wow-api/wow-api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../database/entities/auction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScannerService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly wowApi: WowApiService,
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
  ) {
  }

  /**
   * Méthode principale qui permet de scanner les hotels des ventes
   * de chaque serveur
   */
  public async scan() {
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
            .pipe(take(1))
            .subscribe(async auction => await this.saveAuctions(auction)),
        error: err => Logger.error(err),
      });
    });
  }

  private auctionFilter(auction: any) {
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
