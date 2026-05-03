import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); //  attendre MongoDB

    const server = app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error(`Erreur non gérée: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("Erreur au démarrage serveur:", error);
    process.exit(1);
  }
};

startServer();