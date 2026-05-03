import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    console.log("🔌 Connexion MongoDB en cours...");
    console.log("URI =", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log(" MongoDB connecté !");
    console.log("Host:", conn.connection.host);
    console.log("DB Name:", conn.connection.name);

  } catch (error: any) {
    console.error(" Erreur MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;