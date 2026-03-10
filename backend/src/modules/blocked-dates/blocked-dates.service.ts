import { prisma } from "../../lib/prisma";
import { CreateBlockedDateSchema } from "./blocked-dates.schema";

export class BlockedDatesService{

    async create(data: CreateBlockedDateSchema){

        const professional = await prisma.professional.findUnique({
            where: {id: data.professionalId},
        });

        if(!professional){
            throw new Error("Profissional não encontrado.");
        }

        const existingBlockedDate = await prisma.blockedDate.findFirst({
            where:{
                professionalId: data.professionalId,
                date: data.date,
            },
        });

        if(existingBlockedDate){
            throw new Error("Data já bloqueada.");
        }

        const blockedDate = await prisma.blockedDate.create({
            data:{
                date: data.date,
                reason: data.reason ?? null,
                professionalId: data.professionalId,
            },
        });

        return blockedDate;

    }

    async findByProfessional(professionalId: string){

        const professional = await prisma.professional.findUnique({
            where: {id: professionalId},
        });

        if(!professional){
            throw new Error("Profissional não encontrado.");
        }

        const blockedDates = await prisma.blockedDate.findMany({
            where: {professionalId},
            orderBy: {date: "asc"},
        });

        return blockedDates;

    }

    async delete(id: string){

        const blockedDate = await prisma.blockedDate.findUnique({
            where: {id},
        });

        if(!blockedDate){
            throw new Error("Data bloqueada não encontrada.");
        }

        await prisma.blockedDate.delete({
            where: {id},
        });

        return { message: "Data bloqueada excluída com sucesso." };

    }

}