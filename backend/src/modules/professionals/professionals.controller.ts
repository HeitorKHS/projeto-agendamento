import { FastifyRequest, FastifyReply } from "fastify";
import { ProfessionalsService } from "./professionals.service";
import { createProfessionalSchema, updateProfessionalSchema } from "./professionals.schema";

{/*
    Código de erro
    201 - Profissional criado com sucesso
    200 - Operação realizada com sucesso
    400 - Dados inválidos (erro do Zod)
    404 - Profissional não encontrado
    500 - Erro inesperado do servidor
*/}

const professionalsService = new ProfessionalsService();

export class ProfessionalsController{

    async create(req: FastifyRequest, reply: FastifyReply){

        try{
            
            const body = createProfessionalSchema.parse(req.body);
            const professional = await professionalsService.create(body);
            return reply.status(201).send(professional);
            
        } catch(error:any){

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do servidor interno." })

        }

    }

    async findAll(req: FastifyRequest, reply: FastifyReply){

        try{

            const professionals = await professionalsService.findAll();
            return reply.status(200).send(professionals);

        } catch(error:any){

            return reply.status(500).send({ message: "Erro do servidor interno." })

        }

    }

    async findById(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id: string};
            const professional = await professionalsService.findById(id);
            return reply.status(200).send(professional);

        } catch(error:any){

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro do servidor interno." })

        }

    }

    async update(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id:string};
            const body = updateProfessionalSchema.parse(req.body);
            const professional = await professionalsService.update(id, body);
            return reply.status(200).send(professional);

        } catch(error:any){

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do servidor interno." });

        }

    }

    async delete(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id:string};
            const message = await professionalsService.delete(id);
            return reply.status(200).send({ message: message });

        } catch(error:any){

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro do servidor interno." });

        }

    }

}