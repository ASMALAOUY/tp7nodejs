import Joi from 'joi';

export const registerSchema = Joi.object({
  nom: Joi.string().trim().max(50).required().messages({
    'any.required': 'Le nom est requis'
  }),
  prenom: Joi.string().trim().max(50).required().messages({
    'any.required': 'Le prénom est requis'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Veuillez fournir un email valide',
    'any.required': "L'email est requis"
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères',
    'any.required': 'Le mot de passe est requis'
  }),
  role: Joi.string().valid('utilisateur', 'bibliothecaire', 'admin')
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'any.required': "L'email est requis"
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis'
  })
});

export const updateUtilisateurSchema = Joi.object({
  nom: Joi.string().trim().max(50),
  prenom: Joi.string().trim().max(50),
  email: Joi.string().trim().email(),
  role: Joi.string().valid('utilisateur', 'bibliothecaire', 'admin')
});