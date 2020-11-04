import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'tsvector', nullable: true })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  item: any;
}
