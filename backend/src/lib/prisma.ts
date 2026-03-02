//Importa automaticamente as variáveis do .env
import "dotenv/config";
//É o adapter que conecta o Prisma ao SQLite usando a biblioteca better-sqlite3
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"; 
import { PrismaClient } from "../../generated/prisma/client";

/// Pega a string de conexão definida no .env (DATABASE_URL)
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };