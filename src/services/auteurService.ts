import Auteur, { IAuteur } from '../models/Auteur';
import mongoose from 'mongoose';

interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  nom?: string;
  prenom?: string;
}

export const createAuteur = async (auteurData: Partial<IAuteur>): Promise<IAuteur> => {
  return await Auteur.create(auteurData);
};

export const getAllAuteurs = async (options: QueryOptions = {}): Promise<{ auteurs: IAuteur[]; pagination: any }> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (options.nom) filter.nom = { $regex: options.nom, $options: 'i' };
  if (options.prenom) filter.prenom = { $regex: options.prenom, $options: 'i' };

  let sort: any = { createdAt: -1 };
  if (options.sort) {
    const sortField = options.sort.startsWith('-') ? options.sort.substring(1) : options.sort;
    const sortOrder = options.sort.startsWith('-') ? -1 : 1;
    sort = { [sortField]: sortOrder };
  }

  const auteurs = await Auteur.find(filter).sort(sort).skip(skip).limit(limit);
  const total = await Auteur.countDocuments(filter);

  return {
    auteurs,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total }
  };
};

export const getAuteurById = async (id: string): Promise<IAuteur | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Auteur.findById(id);
};

export const updateAuteur = async (id: string, auteurData: Partial<IAuteur>): Promise<IAuteur | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Auteur.findByIdAndUpdate(id, auteurData, { new: true, runValidators: true });
};

export const deleteAuteur = async (id: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const result = await Auteur.findByIdAndDelete(id);
  return result !== null;
};