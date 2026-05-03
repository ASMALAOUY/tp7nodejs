import Joi from 'joi';

export const createEmpruntSchema = Joi.object({
  livre: Joi.string().hex().length(24).required().messages({
    'any.required': 'Le livre est requis'
  }),
  utilisateur: Joi.string().hex().length(24).required().messages({
    'any.required': "L'utilisateur est requis"
  }),
  dateRetourPrevue: Joi.date().iso().min('now').required().messages({
    'date.min': 'La date de retour prévue doit être dans le futur',
    'any.required': 'La date de retour prévue est requise'
  })
});

export const updateEmpruntSchema = Joi.object({
  dateRetourEffective: Joi.date().iso(),
  statut: Joi.string().valid('emprunte', 'rendu', 'en_retard'),
  dateRetourPrevue: Joi.date().iso()
});