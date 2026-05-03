import Utilisateur, { IUtilisateur } from '../models/Utilisateur';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const register = async (userData: Partial<IUtilisateur>): Promise<{ utilisateur: IUtilisateur; token: string }> => {
  const existing = await Utilisateur.findOne({ email: userData.email });
  if (existing) throw new Error('Un utilisateur avec cet email existe déjà');

  const utilisateur = await Utilisateur.create(userData);
  const token = generateToken(utilisateur._id as string);
  return { utilisateur, token };
};

export const login = async (email: string, password: string): Promise<{ utilisateur: IUtilisateur; token: string }> => {
  const utilisateur = await Utilisateur.findOne({ email }).select('+password');
  if (!utilisateur) throw new Error('Email ou mot de passe incorrect');

  const isMatch = await utilisateur.comparePassword(password);
  if (!isMatch) throw new Error('Email ou mot de passe incorrect');

  const token = generateToken(utilisateur._id as string);
  return { utilisateur, token };
};

export const getAllUtilisateurs = async (options: { page?: number; limit?: number } = {}): Promise<{ utilisateurs: IUtilisateur[]; pagination: any }> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const utilisateurs = await Utilisateur.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Utilisateur.countDocuments();

  return {
    utilisateurs,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total }
  };
};

export const getUtilisateurById = async (id: string): Promise<IUtilisateur | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Utilisateur.findById(id);
};

export const updateUtilisateur = async (id: string, userData: Partial<IUtilisateur>): Promise<IUtilisateur | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Utilisateur.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
};

export const deleteUtilisateur = async (id: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const result = await Utilisateur.findByIdAndDelete(id);
  return result !== null;
};

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};