import { FastifyRequest, FastifyReply } from "fastify";
import { BlockedDatesService } from "./blocked-dates.service";
import { createBlockedDateSchema } from "./blocked-dates.schema";

{/*
    Código de erro
    201 - Data bloqueado criado com sucesso
    200 - Operação realizada com sucesso
    400 - Dados inválidos (erro do Zod)
    404 - Data bloqueado não encontrado
    409 - Data já bloqueado
    500 - Erro inesperado do servidor
*/}

const blockedDateSchema = new BlockedDatesService();

export class BlockedDatesController{

    async create(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = createBlockedDateSchema.parse(req.body);
            const blockedDate = await blockedDateSchema.create(body);
            return reply.status(201).send(blockedDate);

        } catch(error:any){

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: "Profissional não encontrado." });
            }

            if(error.message === "Data já bloqueada."){
                return reply.status(409).send({ message: "Data já bloqueada." });
            }

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }
        
    }

    async findByProfessional(req: FastifyRequest, reply: FastifyReply){

        try{

            const {professionalId} = req.params as {professionalId: string};
            const blockedDates = await blockedDateSchema.findByProfessional(professionalId);
            return reply.status(200).send(blockedDates);

        } catch(error:any){

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async delete(req: FastifyRequest, reply: FastifyReply){

        try{

            const {id} = req.params as {id: string};
            const result = await blockedDateSchema.delete(id);
            return reply.status(200).send(result);

        } catch(error:any){

            if(error.message === "Data bloqueada não encontrada."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Error do Servidor Interno." });

        }

    }

}