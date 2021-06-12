import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './Profile';

@Entity('movies')
class Movie{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  profile_id: number;

  @Column()
  movie_id: number;

  @Column()
  watched: boolean;

  @ManyToOne(() => Profile, profile => profile.movies)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}

export { Movie }