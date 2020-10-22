import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'json' })
  auction_rules: any;
}
