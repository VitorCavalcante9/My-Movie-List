import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcryptjs';
import { Profile } from './Profile';

@Entity('users')
class User{
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  birth_date: Date;

  constructor(){
    if(!this.id) this.id = uuid();
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(){
    this.password = bcrypt.hashSync(this.password, 8);
  }

  @OneToMany(() => Profile, profile => profile.user, {
    cascade: ['insert', 'update', 'remove']
  })
  @JoinColumn({ name: 'user_id' })
  profiles: Profile[];
}

export { User }