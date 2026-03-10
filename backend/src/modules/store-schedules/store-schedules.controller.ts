import { FastifyRequest, FastifyReply } from "fastify";
import { StoreSchedulesService } from "./store-schedules.service";
import { createStoreScheduleSchema, updateStoreScheduleSchema } from "./store-schedules.schema";

{/*
    Código de erro
    201 - Agenda da loja criado com sucesso
    200 - Operação realizada com sucesso
    400 - Dados inválidos (erro do Zod)
    404 - Agenda da loja não encontrado
    500 - Erro inesperado do servidor
*/}

const storeScheduleService = new StoreSchedulesService();

export class StoreSchedulesController{

    async create(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = createStoreScheduleSchema.parse(req.body);
            const storeSchedule = await storeScheduleService.create(body);
            return reply.status(201).send(storeSchedule);

        } catch(error:any){

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async findAll(req: FastifyRequest, reply: FastifyReply){

        try{

            const storeSchedules = await storeScheduleService.findAll();
            return reply.status(200).send(storeSchedules);

        } catch(error:any){

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async findById(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id: string};
            const storeSchedule = await storeScheduleService.findById(id);
            return reply.status(200).send(storeSchedule);

        } catch(error:any){

            if(error.message === "Agenda da loja não encontrada."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async findByDay(req: FastifyRequest, reply: FastifyReply){

        try{

            const { dayOfWeek } = req.params as {dayOfWeek: string};
            const storeSchedules = await storeScheduleService.findByDay(Number(dayOfWeek));
            return reply.status(200).send(storeSchedules);

        } catch(error:any){

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async update(req: FastifyRequest, reply: FastifyReply){

        try{

            const {id} = req.params as {id: string};
            const body = updateStoreScheduleSchema.parse(req.body);
            const storeSchedule = await storeScheduleService.update(id, body);
            return reply.status(200).send(storeSchedule);

        } catch(error:any){

            if(error.message === "Agenda da loja não encontrada."){
                return reply.status(404).send({ message: error.message });
            }

            if(error?.issues){
                return reply.status(400).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Error do Servidor Interno." });

        }

    }

    async delete(req: FastifyRequest, reply: FastifyReply){

        try{

            const {id} = req.params as {id: string};
            const storeSchedule = await storeScheduleService.delete(id);
            return reply.status(200).send(storeSchedule);

        } catch(error:any){

            if(error.message === "Agenda da loja não encontrada."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Error do Servidor Interno." });

        }

    }

}