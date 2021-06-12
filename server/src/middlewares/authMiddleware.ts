import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayLoad{
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(
  request: Request, response: Response, next: NextFunction
){
  const { authorization } = request.headers;
  
  if(!authorization){
    return response.status(401).json({message: 'Você não está autorizado, faça login novamente'});
  }

  const token = authorization.replace('Bearer', '').trim();

  try{
    const data = jwt.verify(token, process.env.APP_KEY);
    
    const { id } = data as TokenPayLoad;

    request.userId = id;

    return next();

  } catch {
    return response.status(401).json({message: 'Você não está autorizado, faça login novamente'});
  }
}