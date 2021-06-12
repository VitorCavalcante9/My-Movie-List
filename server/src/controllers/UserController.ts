import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../models/AppError';
import { ProfilesRepository } from '../repositories/ProfilesRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import UsersView from '../views/UsersView';

class UserController{
  async store(req: Request, res: Response){
    const { name, email, password, birthDate} = req.body;

    const schema = yup.object().shape({
      name: yup.string().min(3).max(50).required('Insira um nome válido'),
      email: yup.string().email().required('Email inválido'),
      password: yup.string().min(4).required('Senha inválida'),
      birthDate: yup.date().required('Data de Nascimento Inválida')
    });

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err.message);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const usersAlreadyExists = await usersRepository.findOne({email});

    if(usersAlreadyExists){
      throw new AppError('Email já cadastrado!');
    }

    const user = usersRepository.create({
      name, email, password, birth_date: birthDate
    });

    await usersRepository.save(user);

    const profilesRepository = getCustomRepository(ProfilesRepository);
    
    const profile = profilesRepository.create({ name, number: 1, user_id: user.id });
    await profilesRepository.save(profile);

    return res.status(201).json({ name, email, birthDate });
  }

  async show(req: Request, res: Response){
    const usersRepository = getCustomRepository(UsersRepository);
    
    const id = req.userId;
    const user = await usersRepository.findOne({id});

    return res.json(UsersView.render(user));
  }

  async update(req: Request, res: Response){
    const { name } = req.body;

    const schema = yup.object().shape({
      name: yup.string().min(3).max(50).required('Insira um nome válido')   
    });

    try{
      await schema.validate(req.body, {abortEarly: false});
    }
    catch(err){
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const id = req.userId;

    try{

      const currentUserData = await usersRepository.findOne(id);
      
      const newUserData = {
        ...currentUserData,
        name
      }

      await usersRepository.update(id, newUserData);

    } catch(err) {
      throw new AppError(err.message);
    }

    return res.status(200).json({ message: 'Atualizado com sucesso!'});
  }

  async delete(req: Request, res: Response){
    const usersRepository = getCustomRepository(UsersRepository);
    
    const id = req.userId;

    try{
      await usersRepository.delete(id);

    } catch(err) {
      throw new AppError(err.message);
    }

    return res.sendStatus(200);
  }
}

export default new UserController();