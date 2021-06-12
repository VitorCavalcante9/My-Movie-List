import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../models/AppError';
import { ProfilesRepository } from '../repositories/ProfilesRepository';

class ProfileController{
  async store(req: Request, res: Response){
    const { name } = req.body;

    const schema = yup.object().shape({
      name: yup.string().min(3).max(50).required('Insira um nome válido')
    });

    try{
      await schema.validate(req.body, {abortEarly: false});

      const profilesRepository = getCustomRepository(ProfilesRepository);
      const id = req.userId;

      const existingProfiles = await profilesRepository.findAndCount({ where: { user_id: id }});
      
      if(existingProfiles[1] === 4)
        throw new AppError("Você só pode criar 4 perfis");

      const number = existingProfiles[1] + 1;
      const profile = profilesRepository.create({ number, user_id: id, name });

      await profilesRepository.save(profile);

      return res.status(201).json(profile);
    }
    catch(err){
      throw new AppError(err.message);
    }
  }

  async show(req: Request, res: Response){
    const { profile_id: id } = req.params;
    const user_id = req.userId;

    const profilesRepository = getCustomRepository(ProfilesRepository);
    
    try{
      const profile = await profilesRepository.findOneOrFail({ where: { user_id, number: id}});
      return res.json(profile);

    } catch {
      throw new AppError('Este perfil não existe');
    }
  }

  async index(req: Request, res: Response){
    const profilesRepository = getCustomRepository(ProfilesRepository);
    const user_id = req.userId;

    try{
      const profiles = await profilesRepository.find({ where: { user_id }});
      return res.json(profiles);

    } catch {
      throw new AppError('Este perfil não existe');
    }
  }

  async update(req: Request, res: Response){
    const { name } = req.body;
    const { profile_id: id } = req.params;
    const user_id = req.userId;

    const schema = yup.object().shape({
      name: yup.string().min(3).max(50).required('Insira um nome válido')
    });

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }


    try{
      const profilesRepository = getCustomRepository(ProfilesRepository);
      const currentProfileData = await profilesRepository.findOneOrFail({ where: { user_id, number: id}});

      const newProfileData = {
        ...currentProfileData,
        name
      }

      await profilesRepository.update(currentProfileData.id, newProfileData);

    } catch {
      throw new AppError('Este perfil não existe');
    }

    return res.json({ message: 'Atualizado com sucesso!'});
  }

  async delete(req: Request, res: Response){
    const { profile_id: id } = req.params;
    const user_id = req.userId;

    const profilesRepository = getCustomRepository(ProfilesRepository);

    try{
      const existingProfiles = await profilesRepository.findAndCount({ where: { user_id }});

      if(existingProfiles[1] === 1){
        throw new AppError("Você não pode excluir seu único perfil");
      }        
      else{
        await profilesRepository.delete({ user_id, number: Number(id) });
        return res.sendStatus(200);
      }

    } catch(err) {
      throw new AppError(err.message);
      
    }
  }
}

export default new ProfileController();
