import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

const authService = new AuthService();

export class AuthController{

    async register(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = registerSchema.parse(req.body);

            const user = await authService.register(body);

            return reply.status(201).send(user)

        } catch(error:any){

            if (error.message === "E-mail já em uso.") {
                return reply.status(409).send({ message: error.message });
            }
            //zod
            if (error?.issues) {
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno" });

        }


    }

    async login(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = loginSchema.parse(req.body);

            const user = await authService.login(body);

            const token = await reply.jwtSign({
                sub: user.id,
                role: user.role,
            });

            return reply.status(200).send({ token });

        } catch(error:any){

            if (error.message === "E-mail ou senha inválidos.") {
                return reply.status(401).send({ message: error.message });
            }
            //zod
            if (error?.issues) {
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno" });

        }

    }

}