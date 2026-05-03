import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Utilisateur from '../models/Utilisateur';

declare global {
  namespace Express {
    interface Request {
      utilisateur?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé à accéder à cette ressource'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.utilisateur = await Utilisateur.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé à accéder à cette ressource'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.utilisateur) {
      return res.status(401).json({ success: false, error: 'Non autorisé' });
    }
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({
        success: false,
        error: `Le rôle ${req.utilisateur.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};