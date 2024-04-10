import * as dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

export const mongoConnect = async () => {
  try {
    console.log("Conectando ao MongoDB...");
    await connect(process.env.MONGO_URL as string);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.log(`Erro conexão mongoDB: ${error}`);
  }
};
