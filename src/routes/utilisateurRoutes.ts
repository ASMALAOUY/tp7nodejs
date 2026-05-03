import express from 'express';
import * as utilisateurController from '../controllers/utilisateurController';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema, updateUtilisateurSchema } from '../validations/utilisateurValidation';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// Routes publiques (authentification)
router.post('/register', validateRequest(registerSchema), utilisateurController.register);
router.post('/login', validateRequest(loginSchema), utilisateurController.login);

// Route protégée - profil de l'utilisateur connecté
router.get('/me', protect, utilisateurController.getMe);

// Routes admin
router.route('/')
  .get(protect, authorize('admin'), utilisateurController.getAllUtilisateurs);

router.route('/:id')
  .get(protect, authorize('admin'), utilisateurController.getUtilisateurById)
  .put(protect, authorize('admin'), validateRequest(updateUtilisateurSchema), utilisateurController.updateUtilisateur)
  .delete(protect, authorize('admin'), utilisateurController.deleteUtilisateur);

export default router;