import { Request, Response } from 'express';
import * as livreService from '../services/livreService';

export const createLivre = async (req: Request, res: Response) => {
  try {
    const livre = await livreService.createLivre(req.body);
    res.status(201).json({ success: true, data: livre });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllLivres = async (req: Request, res: Response) => {
  try {
    const options = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: req.query.sort as string,
      titre: req.query.titre as string,
      genre: req.query.genre as string,
      auteur: req.query.auteur as string,
      disponible: req.query.disponible as string
    };
    const result = await livreService.getAllLivres(options);
    res.status(200).json({ success: true, data: result.livres, pagination: result.pagination });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLivreById = async (req: Request, res: Response) => {
  try {
    const livre = await livreService.getLivreById(req.params.id);
    if (!livre) return res.status(404).json({ success: false, error: 'Livre non trouvé' });
    res.status(200).json({ success: true, data: livre });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateLivre = async (req: Request, res: Response) => {
  try {
    const livre = await livreService.updateLivre(req.params.id, req.body);
    if (!livre) return res.status(404).json({ success: false, error: 'Livre non trouvé' });
    res.status(200).json({ success: true, data: livre });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteLivre = async (req: Request, res: Response) => {
  try {
    const deleted = await livreService.deleteLivre(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Livre non trouvé' });
    res.status(204).json({ success: true, data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};