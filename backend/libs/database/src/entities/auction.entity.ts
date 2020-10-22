import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'json' })
  auction: any;
}
