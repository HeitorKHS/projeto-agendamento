import { FastifyRequest, FastifyReply } from "fastify";
import { ServicesService } from "./services.service";
import { createServiceSchema, updateServiceSchema } from "./services.schema";

{/*
    Código de erro
    201 - Serviço criado com sucesso
    200 - Operação realizada com sucesso
    400 - Dados inválidos (erro do Zod)
    404 - Serviço não encontrado
    500 - Erro inesperado do servidor
*/}

const servicesService = new ServicesService();

export class ServicesController{

    async create(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = createServiceSchema.parse(req.body);
            const service = await servicesService.create(body);
            return reply.status(201).send(service);

        } catch(error:any){

            if (error?.issues) {
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async findAll(req: FastifyRequest, reply: FastifyReply){

        try{

            const services = await servicesService.findAll();
            return reply.status(200).send(services);

        } catch(error:any){

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async findById(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id: string};
            const service = await servicesService.findById(id);
            return reply.status(200).send(service);

        } catch(error:any){

            if(error.message === "Serviço não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro no Servidor Interno." })

        }

    }

    async update(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id: string};
            const body = updateServiceSchema.parse(req.body);
            const service = await servicesService.update(id, body);
            return reply.status(200).send(service);

        } catch(error:any){

            if(error.message === "Serviço não encontrado."){
                return reply.status(404).send({ message: "Serviço não encontrado." });
            }

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro no Servidor Interno." });

        }

    }

    async delete(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id: string};
            const result = await servicesService.delete(id);
            return reply.status(200).send({ message: result });

        } catch(error:any){

            if(error.message === "Serviço não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro no Servidor Interno." });

        }

    }

}