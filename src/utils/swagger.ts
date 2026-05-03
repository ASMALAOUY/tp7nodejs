import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de Bibliothèque',
    version: '1.0.0',
    description: "API RESTful pour la gestion d'une bibliothèque"
  },
  servers: [{ url: '/api/v1', description: 'Serveur de développement' }],
  tags: [
    { name: 'Auteurs', description: 'Opérations sur les auteurs' },
    { name: 'Livres', description: 'Opérations sur les livres' },
    { name: 'Emprunts', description: 'Opérations sur les emprunts' },
    { name: 'Utilisateurs', description: 'Authentification et gestion des utilisateurs' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Auteur: {
        type: 'object',
        required: ['nom', 'prenom', 'dateNaissance'],
        properties: {
          _id: { type: 'string' },
          nom: { type: 'string', example: 'Hugo' },
          prenom: { type: 'string', example: 'Victor' },
          dateNaissance: { type: 'string', format: 'date', example: '1802-02-26' },
          biographie: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Livre: {
        type: 'object',
        required: ['titre', 'auteur', 'isbn', 'anneePublication', 'genre'],
        properties: {
          _id: { type: 'string' },
          titre: { type: 'string', example: 'Les Misérables' },
          auteur: { type: 'string', description: 'ID de l\'auteur' },
          isbn: { type: 'string', example: '978-2-07-040850-4' },
          anneePublication: { type: 'integer', example: 1862 },
          genre: { type: 'array', items: { type: 'string' }, example: ['Roman'] },
          resume: { type: 'string' },
          disponible: { type: 'boolean', default: true }
        }
      },
      Emprunt: {
        type: 'object',
        required: ['livre', 'utilisateur', 'dateRetourPrevue'],
        properties: {
          _id: { type: 'string' },
          livre: { type: 'string' },
          utilisateur: { type: 'string' },
          dateEmprunt: { type: 'string', format: 'date-time' },
          dateRetourPrevue: { type: 'string', format: 'date-time' },
          dateRetourEffective: { type: 'string', format: 'date-time' },
          statut: { type: 'string', enum: ['emprunte', 'rendu', 'en_retard'] }
        }
      },
      Utilisateur: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nom: { type: 'string' },
          prenom: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['utilisateur', 'bibliothecaire', 'admin'] }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          totalPages: { type: 'integer' },
          totalItems: { type: 'integer' }
        }
      }
    }
  },
  paths: {
    '/auteurs': {
      get: {
        tags: ['Auteurs'],
        summary: 'Récupérer tous les auteurs',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'sort', in: 'query', schema: { type: 'string', example: '-createdAt' } },
          { name: 'nom', in: 'query', schema: { type: 'string' } },
          { name: 'prenom', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Liste des auteurs' },
          '500': { description: 'Erreur serveur' }
        }
      },
      post: {
        tags: ['Auteurs'],
        summary: 'Créer un nouvel auteur',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Auteur' }
            }
          }
        },
        responses: {
          '201': { description: 'Auteur créé' },
          '400': { description: 'Données invalides' },
          '401': { description: 'Non autorisé' },
          '403': { description: 'Accès interdit' }
        }
      }
    },
    '/auteurs/{id}': {
      get: {
        tags: ['Auteurs'],
        summary: 'Récupérer un auteur par ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Auteur trouvé' }, '404': { description: 'Auteur non trouvé' } }
      },
      put: {
        tags: ['Auteurs'],
        summary: 'Mettre à jour un auteur',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Auteur' } } } },
        responses: { '200': { description: 'Auteur mis à jour' }, '404': { description: 'Auteur non trouvé' } }
      },
      delete: {
        tags: ['Auteurs'],
        summary: 'Supprimer un auteur',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Auteur supprimé' }, '404': { description: 'Auteur non trouvé' } }
      }
    },
    '/livres': {
      get: {
        tags: ['Livres'],
        summary: 'Récupérer tous les livres',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'titre', in: 'query', schema: { type: 'string' } },
          { name: 'genre', in: 'query', schema: { type: 'string' } },
          { name: 'disponible', in: 'query', schema: { type: 'boolean' } }
        ],
        responses: { '200': { description: 'Liste des livres' } }
      },
      post: {
        tags: ['Livres'],
        summary: 'Créer un nouveau livre',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Livre' } } } },
        responses: { '201': { description: 'Livre créé' }, '400': { description: 'Données invalides' } }
      }
    },
    '/utilisateurs/register': {
      post: {
        tags: ['Utilisateurs'],
        summary: "S'inscrire",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nom', 'prenom', 'email', 'password'],
                properties: {
                  nom: { type: 'string' }, prenom: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 }
                }
              }
            }
          }
        },
        responses: { '201': { description: 'Utilisateur créé avec token JWT' } }
      }
    },
    '/utilisateurs/login': {
      post: {
        tags: ['Utilisateurs'],
        summary: 'Se connecter',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Connexion réussie avec token JWT' }, '401': { description: 'Identifiants incorrects' } }
      }
    },
    '/emprunts': {
      get: {
        tags: ['Emprunts'],
        summary: 'Récupérer tous les emprunts',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'statut', in: 'query', schema: { type: 'string', enum: ['emprunte', 'rendu', 'en_retard'] } }
        ],
        responses: { '200': { description: 'Liste des emprunts' } }
      },
      post: {
        tags: ['Emprunts'],
        summary: 'Créer un emprunt',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Emprunt' } } } },
        responses: { '201': { description: 'Emprunt créé' }, '400': { description: 'Livre non disponible' } }
      }
    }
  }
};

export const setupSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Documentation Swagger disponible sur /api-docs');
};