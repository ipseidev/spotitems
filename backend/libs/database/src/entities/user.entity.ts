import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;
  @OneToOne(type => Profile, { eager: true })
  @JoinColumn()
  profile: Profile;
}
