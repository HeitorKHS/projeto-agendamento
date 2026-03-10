import { FastifyRequest, FastifyReply } from "fastify";
import { BlockedSlotsService } from "./blocked-slots.service";
import { createBlockedSlotSchema } from "./blocked-slots.schema";

{/*
    Código de erro
    201 - Slot bloqueado criado com sucesso
    200 - Operação realizada com sucesso
    400 - Dados inválidos (erro do Zod)
    404 - Slot bloqueado não encontrado
    409 - Slot já bloqueado
    500 - Erro inesperado do servidor
*/}

const blockedSlotsService = new BlockedSlotsService();

export class BlockedSlotsController{

    async create(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = createBlockedSlotSchema.parse(req.body);
            const blockedSlot = await blockedSlotsService.create(body);
            return reply.status(201).send(blockedSlot);

        } catch(error:any){

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            if(error.message === "Slot já bloqueado."){
                return reply.status(409).send({ message: error.message });
            }

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Error do Servidor Interno." });

        }

    }

    async findByProfessionalAndDate(req: FastifyRequest, reply: FastifyReply){

        try{

            const {professionalId, date} = req.params as {professionalId: string, date: string};
            const blockedSlots = await blockedSlotsService.findByProfessionalAndDate(professionalId, date);
            return reply.status(200).send(blockedSlots);

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
            const result = await blockedSlotsService.delete(id);
            return reply.status(200).send({ message: result });

        } catch(error:any){

            if(error.message === "Slot bloqueado não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro no Servidor Interno." });

        }

    }

}