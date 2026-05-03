import Joi from 'joi';

const GENRES_VALIDES = ['Roman', 'Science-Fiction', 'Fantastique', 'Policier', 'Biographie', 'Histoire', 'Philosophie', 'Poésie', 'Théâtre', 'Jeunesse', 'Autre'];

export const createLivreSchema = Joi.object({
  titre: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Le titre ne peut pas être vide',
    'string.max': 'Le titre ne peut pas dépasser {#limit} caractères',
    'any.required': 'Le titre est requis'
  }),
  auteur: Joi.string().hex().length(24).required().messages({
    'any.required': "L'auteur est requis",
    'string.length': "L'ID de l'auteur doit être un ObjectId valide"
  }),
  isbn: Joi.string().trim().required().messages({
    'any.required': "L'ISBN est requis"
  }),
  anneePublication: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required()
    .messages({
      'any.required': "L'année de publication est requise",
      'number.min': "L'année doit être supérieure à 1000",
      'number.max': "L'année ne peut pas être dans le futur"
    }),
  genre: Joi.array().items(Joi.string().valid(...GENRES_VALIDES)).min(1).required().messages({
    'any.required': 'Au moins un genre est requis',
    'array.min': 'Au moins un genre est requis'
  }),
  resume: Joi.string().trim().max(2000).allow('', null),
  disponible: Joi.boolean()
});

export const updateLivreSchema = createLivreSchema.fork(
  ['titre', 'auteur', 'isbn', 'anneePublication', 'genre'],
  (schema) => schema.optional()
);