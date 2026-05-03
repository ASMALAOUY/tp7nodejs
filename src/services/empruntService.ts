import Emprunt, { IEmprunt } from '../models/Emprunt';
import Livre from '../models/Livre';
import mongoose from 'mongoose';

interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  statut?: string;
  utilisateur?: string;
  livre?: string;
}

export const createEmprunt = async (empruntData: Partial<IEmprunt>): Promise<IEmprunt> => {
  // Vérifier que le livre est disponible
  const livre = await Livre.findById(empruntData.livre);
  if (!livre) throw new Error('Livre non trouvé');
  if (!livre.disponible) throw new Error('Ce livre n\'est pas disponible pour l\'emprunt');

  // Marquer le livre comme indisponible
  await Livre.findByIdAndUpdate(empruntData.livre, { disponible: false });

  return await Emprunt.create(empruntData);
};

export const getAllEmprunts = async (options: QueryOptions = {}): Promise<{ emprunts: IEmprunt[]; pagination: any }> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (options.statut) filter.statut = options.statut;
  if (options.utilisateur && mongoose.Types.ObjectId.isValid(options.utilisateur)) filter.utilisateur = options.utilisateur;
  if (options.livre && mongoose.Types.ObjectId.isValid(options.livre)) filter.livre = options.livre;

  let sort: any = { createdAt: -1 };
  if (options.sort) {
    const sortField = options.sort.startsWith('-') ? options.sort.substring(1) : options.sort;
    sort = { [sortField]: options.sort.startsWith('-') ? -1 : 1 };
  }

  const emprunts = await Emprunt.find(filter)
    .populate('livre', 'titre isbn')
    .populate('utilisateur', 'nom prenom email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Emprunt.countDocuments(filter);

  return {
    emprunts,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total }
  };
};

export const getEmpruntById = async (id: string): Promise<IEmprunt | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Emprunt.findById(id)
    .populate('livre', 'titre isbn auteur')
    .populate('utilisateur', 'nom prenom email');
};

export const updateEmprunt = async (id: string, empruntData: Partial<IEmprunt>): Promise<IEmprunt | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const emprunt = await Emprunt.findById(id);
  if (!emprunt) return null;

  // Si le livre est rendu, on le rend disponible
  if (empruntData.statut === 'rendu' && emprunt.statut !== 'rendu') {
    await Livre.findByIdAndUpdate(emprunt.livre, { disponible: true });
    if (!empruntData.dateRetourEffective) {
      empruntData.dateRetourEffective = new Date();
    }
  }

  return await Emprunt.findByIdAndUpdate(id, empruntData, { new: true, runValidators: true })
    .populate('livre', 'titre isbn')
    .populate('utilisateur', 'nom prenom email');
};

export const deleteEmprunt = async (id: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const result = await Emprunt.findByIdAndDelete(id);
  return result !== null;
};