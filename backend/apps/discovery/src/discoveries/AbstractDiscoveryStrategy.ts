export abstract class AbstractDiscoveryStrategy {
  protected constructor(private readonly id: number) {}

  abstract async pipeline(): Promise<void>;
  abstract async itemExist(): Promise<boolean>;
  abstract async saveItem(): Promise<void>;
}
