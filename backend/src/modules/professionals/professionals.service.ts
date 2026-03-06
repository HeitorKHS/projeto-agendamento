import { prisma } from "../../lib/prisma";
import { CreateProfessionalSchema, UpdateProfessionalSchema } from "./professionals.schema";

export class ProfessionalsService{

    async create(data: CreateProfessionalSchema){

        const professional = await prisma.professional.create({
            data:{
                name: data.name,
                phone: data.phone ?? null,
                bio: data.bio ?? null,
            }
        });

        return professional;

    }

    async findAll(){

        const professionals = await prisma.professional.findMany({
            include:{
                workSchedules: true,
                blockedDates: true,
            },
        });

        return professionals;

    }

    async findById(id: string){

        const professional = await prisma.professional.findUnique({
            where:{id},
            include:{
                workSchedules: true,
                blockedDates: true,
            }
        });

        if(!professional){
            throw new Error("Profissional não encontrado.");
        }

        return professional;

    }

    async update(id: string, data: UpdateProfessionalSchema){

        this.findById(id);

        //Object.entries transforma o objeto em um array e o Object.fromEntries tranforma a array em objeto
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([__, value]) => value !== undefined)
        );

        const professional = await prisma.professional.update({
            where:{id},
            data: filteredData,
        });

        return professional;

    }

    async delete(id: string){

        this.findById(id);

        await prisma.professional.delete({where: {id}});

        return { message: "Profissional excluído com sucesso." }

    }

}