import { FastifyRequest, FastifyReply } from "fastify";

//Função principal que recebe o "role" permitido
export function authorize(role: "ADMIN"|"CLIENT"){

    //Retorna uma função assíncrona, essa função é o middleware real que o Fastify vai executar
    return async function (req: FastifyRequest, reply: FastifyReply){

        const user = req.user as {sub: string, role: string};

        if(user.role !== role){

            return reply.status(403).send({ message: "Probido" })

        }

    };

}