import { Request, Response } from 'express';
import * as auteurService from '../services/auteurService';

export const createAuteur = async (req: Request, res: Response) => {
  try {
    const auteur = await auteurService.createAuteur(req.body);
    res.status(201).json({ success: true, data: auteur });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllAuteurs = async (req: Request, res: Response) => {
  try {
    const options = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: req.query.sort as string,
      nom: req.query.nom as string,
      prenom: req.query.prenom as string
    };
    const result = await auteurService.getAllAuteurs(options);
    res.status(200).json({ success: true, data: result.auteurs, pagination: result.pagination });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAuteurById = async (req: Request, res: Response) => {
  try {
    const auteur = await auteurService.getAuteurById(req.params.id);
    if (!auteur) return res.status(404).json({ success: false, error: 'Auteur non trouvé' });
    res.status(200).json({ success: true, data: auteur });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAuteur = async (req: Request, res: Response) => {
  try {
    const auteur = await auteurService.updateAuteur(req.params.id, req.body);
    if (!auteur) return res.status(404).json({ success: false, error: 'Auteur non trouvé' });
    res.status(200).json({ success: true, data: auteur });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAuteur = async (req: Request, res: Response) => {
  try {
    const deleted = await auteurService.deleteAuteur(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Auteur non trouvé' });
    res.status(204).json({ success: true, data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};