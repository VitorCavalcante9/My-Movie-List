import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';
import { User } from './User';

@Entity('profiles')
class Profile{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: string;

  @Column()
  number: number;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.profiles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Movie, movie => movie.profile)
  @JoinColumn({ name: 'profile_id' })
  movies: Movie[];
}

export { Profile }