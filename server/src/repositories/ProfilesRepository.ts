import { EntityRepository, Repository } from 'typeorm';
import { Profile } from '../models/Profile';

@EntityRepository(Profile)
class ProfilesRepository extends Repository<Profile> {}

export { ProfilesRepository }