import express from 'express';
import * as empruntController from '../controllers/empruntController';
import { validateRequest } from '../middlewares/validateRequest';
import { createEmpruntSchema, updateEmpruntSchema } from '../validations/empruntValidation';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.route('/')
  .get(protect, empruntController.getAllEmprunts)
  .post(
    protect,
    authorize('utilisateur', 'bibliothecaire', 'admin'),
    validateRequest(createEmpruntSchema),
    empruntController.createEmprunt
  );

router.route('/:id')
  .get(protect, empruntController.getEmpruntById)
  .put(
    protect,
    authorize('bibliothecaire', 'admin'),
    validateRequest(updateEmpruntSchema),
    empruntController.updateEmprunt
  )
  .delete(
    protect,
    authorize('admin'),
    empruntController.deleteEmprunt
  );

export default router;