import mongoose, { Document, Schema } from 'mongoose';

export interface IEmprunt extends Document {
  livre: mongoose.Types.ObjectId;
  utilisateur: mongoose.Types.ObjectId;
  dateEmprunt: Date;
  dateRetourPrevue: Date;
  dateRetourEffective?: Date;
  statut: 'emprunte' | 'rendu' | 'en_retard';
  createdAt: Date;
  updatedAt: Date;
}

const EmpruntSchema: Schema = new Schema(
  {
    livre: {
      type: Schema.Types.ObjectId,
      ref: 'Livre',
      required: [true, 'Le livre est requis']
    },
    utilisateur: {
      type: Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: [true, "L'utilisateur est requis"]
    },
    dateEmprunt: {
      type: Date,
      default: Date.now
    },
    dateRetourPrevue: {
      type: Date,
      required: [true, 'La date de retour prévue est requise']
    },
    dateRetourEffective: {
      type: Date
    },
    statut: {
      type: String,
      enum: {
        values: ['emprunte', 'rendu', 'en_retard'],
        message: "{VALUE} n'est pas un statut valide"
      },
      default: 'emprunte'
    }
  },
  { timestamps: true }
);

EmpruntSchema.pre('save', function (next) {
  const emprunt = this as any;
  if (emprunt.statut === 'rendu') return next();
  const now = new Date();
  emprunt.statut = now > emprunt.dateRetourPrevue ? 'en_retard' : 'emprunte';
  next();
});

EmpruntSchema.index({ livre: 1 });
EmpruntSchema.index({ utilisateur: 1 });
EmpruntSchema.index({ statut: 1 });

export default mongoose.model<IEmprunt>('Emprunt', EmpruntSchema);