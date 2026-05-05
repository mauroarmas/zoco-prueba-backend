import mongoose from "mongoose";
import { ConfigService } from "@nestjs/config";
import { NestApplication } from "@nestjs/core";


export const connectDB = async (app: NestApplication) => {

    const configService = app.get(ConfigService);
    const dbUrl = configService.get<string>('DB_URL')!;

    try {
        const {connection}  = await mongoose.connect(dbUrl);
        console.log("Conexión a la base de datos establecida en: ", connection.host);
    } catch (error) {
        console.error("Error de conexión:", error);
        process.exit(1);
    }
}