import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WowApiService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Retourne la liste des serveurs en ligne
   * @param region
   */
  public async getConnectedRealm(region = 'eu') {
    const baseUrl = this.config.get('API_URL').replace('{region}', region);
    const searchParam = new URLSearchParams({
      region,
      namespace: `dynamic-${region}`,
      access_token: this.config.get('TOKEN'),
    });

    const url = `${baseUrl}/connected-realm/index?${searchParam.toString()}`;

    const { data } = await this.http.get(url).toPromise();
    return data.connected_realms.map(url =>
      url.href.match(/[0-9]+/).toString(10),
    );
  }
}
