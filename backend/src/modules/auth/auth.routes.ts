import { FastifyInstance } from "fastify"; //Tipo que representa o servidor Fastify
import { AuthController } from "./auth.controller";

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance){
    app.post("/register", (req, reply) => authController.register(req, reply));
    app.post("/login", (req, reply) => authController.login(req, reply));
};