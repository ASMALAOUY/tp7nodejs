import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUtilisateur extends Document {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'utilisateur' | 'bibliothecaire' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UtilisateurSchema: Schema = new Schema(
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
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['utilisateur', 'bibliothecaire', 'admin'],
        message: "{VALUE} n'est pas un rôle valide"
      },
      default: 'utilisateur'
    }
  },
  { timestamps: true }
);

UtilisateurSchema.pre('save', async function (next) {
  const utilisateur = this as any;
  if (!utilisateur.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    utilisateur.password = await bcrypt.hash(utilisateur.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UtilisateurSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

UtilisateurSchema.index({ email: 1 });

export default mongoose.model<IUtilisateur>('Utilisateur', UtilisateurSchema);