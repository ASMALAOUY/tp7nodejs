import { Request, Response } from 'express';
import * as utilisateurService from '../services/utilisateurService';

export const register = async (req: Request, res: Response) => {
  try {
    const { utilisateur, token } = await utilisateurService.register(req.body);
    res.status(201).json({ success: true, token, data: utilisateur });
  } catch (error: any) {
    const status = error.message.includes('existe déjà') ? 400 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { utilisateur, token } = await utilisateurService.login(req.body.email, req.body.password);
    res.status(200).json({ success: true, token, data: utilisateur });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.utilisateur });
};

export const getAllUtilisateurs = async (req: Request, res: Response) => {
  try {
    const options = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10
    };
    const result = await utilisateurService.getAllUtilisateurs(options);
    res.status(200).json({ success: true, data: result.utilisateurs, pagination: result.pagination });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUtilisateurById = async (req: Request, res: Response) => {
  try {
    const utilisateur = await utilisateurService.getUtilisateurById(req.params.id);
    if (!utilisateur) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    res.status(200).json({ success: true, data: utilisateur });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUtilisateur = async (req: Request, res: Response) => {
  try {
    const utilisateur = await utilisateurService.updateUtilisateur(req.params.id, req.body);
    if (!utilisateur) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    res.status(200).json({ success: true, data: utilisateur });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUtilisateur = async (req: Request, res: Response) => {
  try {
    const deleted = await utilisateurService.deleteUtilisateur(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    res.status(204).json({ success: true, data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};