import mongoose, { Document, Schema } from 'mongoose';

export interface IAuteur extends Document {
  nom: string;
  prenom: string;
  dateNaissance: Date;
  biographie?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuteurSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    dateNaissance: {
      type: Date,
      required: [true, 'La date de naissance est requise']
    },
    biographie: {
      type: String,
      trim: true,
      maxlength: [1000, 'La biographie ne peut pas dépasser 1000 caractères']
    }
  },
  { timestamps: true }
);

AuteurSchema.index({ nom: 1, prenom: 1 });

export default mongoose.model<IAuteur>('Auteur', AuteurSchema);