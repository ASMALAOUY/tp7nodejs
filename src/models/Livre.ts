import mongoose, { Document, Schema } from 'mongoose';

export interface ILivre extends Document {
  titre: string;
  auteur: mongoose.Types.ObjectId;
  isbn: string;
  anneePublication: number;
  genre: string[];
  resume?: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LivreSchema: Schema = new Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    auteur: {
      type: Schema.Types.ObjectId,
      ref: 'Auteur',
      required: [true, "L'auteur est requis"]
    },
    isbn: {
      type: String,
      required: [true, "L'ISBN est requis"],
      unique: true,
      trim: true,
      match: [/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, 'Veuillez fournir un ISBN valide']
    },
    anneePublication: {
      type: Number,
      required: [true, "L'année de publication est requise"],
      min: [1000, "L'année de publication doit être supérieure à 1000"],
      max: [new Date().getFullYear(), "L'année de publication ne peut pas être dans le futur"]
    },
    genre: {
      type: [String],
      required: [true, 'Au moins un genre est requis'],
      enum: {
        values: ['Roman', 'Science-Fiction', 'Fantastique', 'Policier', 'Biographie', 'Histoire', 'Philosophie', 'Poésie', 'Théâtre', 'Jeunesse', 'Autre'],
        message: "{VALUE} n'est pas un genre valide"
      }
    },
    resume: {
      type: String,
      trim: true,
      maxlength: [2000, 'Le résumé ne peut pas dépasser 2000 caractères']
    },
    disponible: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

LivreSchema.index({ titre: 1 });
LivreSchema.index({ isbn: 1 });
LivreSchema.index({ genre: 1 });
LivreSchema.index({ auteur: 1 });

export default mongoose.model<ILivre>('Livre', LivreSchema);