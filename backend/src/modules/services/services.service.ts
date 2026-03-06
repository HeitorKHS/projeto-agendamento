import { prisma } from "../../lib/prisma";
import { CreateServiceSchema, UpdateServiceSchema } from "./services.schema";

export class ServicesService{

    async create(data: CreateServiceSchema){

        const service = await prisma.service.create({
            data:{
                name: data.name,
                description: data.description ?? null,
                price: data.price,
                duration: data.duration,
            },
        });

        return service;

    }

    async findAll(){

        const services = await prisma.service.findMany();

        return services;

    }

    async findById(id: string){

        const service = await prisma.service.findUnique({where: {id}});

        if(!service){
            throw new Error("Serviço não encontrado.");
        }

        return service;

    }

    async update(id: string, data: UpdateServiceSchema){

        await this.findById(id);

        //Object.entries transforma o objeto em um array e o Object.fromEntries tranforma a array em objeto
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        const service = await prisma.service.update({
            where:{id},
            data:filteredData,
        });

        return service;

    }

    async delete(id: string){

        await this.findById(id);

        await prisma.service.delete({where: {id}});

        return { message: "Serviço excluído com sucesso." };

    }

}