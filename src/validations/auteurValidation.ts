import Joi from 'joi';

export const createAuteurSchema = Joi.object({
  nom: Joi.string().trim().max(50).required().messages({
    'string.base': 'Le nom doit être une chaîne de caractères',
    'string.empty': 'Le nom ne peut pas être vide',
    'string.max': 'Le nom ne peut pas dépasser {#limit} caractères',
    'any.required': 'Le nom est requis'
  }),
  prenom: Joi.string().trim().max(50).required().messages({
    'string.base': 'Le prénom doit être une chaîne de caractères',
    'string.empty': 'Le prénom ne peut pas être vide',
    'string.max': 'Le prénom ne peut pas dépasser {#limit} caractères',
    'any.required': 'Le prénom est requis'
  }),
  dateNaissance: Joi.date().iso().required().messages({
    'date.base': 'La date de naissance doit être une date valide',
    'date.format': 'La date de naissance doit être au format ISO',
    'any.required': 'La date de naissance est requise'
  }),
  biographie: Joi.string().trim().max(1000).allow('', null).messages({
    'string.base': 'La biographie doit être une chaîne de caractères',
    'string.max': 'La biographie ne peut pas dépasser {#limit} caractères'
  })
});

export const updateAuteurSchema = createAuteurSchema.fork(
  ['nom', 'prenom', 'dateNaissance'],
  (schema) => schema.optional()
);