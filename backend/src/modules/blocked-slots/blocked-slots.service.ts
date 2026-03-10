import { prisma } from "../../lib/prisma";
import { CreateBlockedSlotSchema } from "./blocked-slots.schema";

export class BlockedSlotsService{

    async create(data: CreateBlockedSlotSchema){

        const professional = await prisma.professional.findUnique({
            where:{id: data.professionalId},
        });

        if(!professional){
            throw new Error("Profissional não encontrado.");
        }

        const existingBlockedSlot = await prisma.blockedSlot.findFirst({
            where:{
                professionalId: data.professionalId,
                date: data.date,
                time: data.time,
            },
        });

        if(existingBlockedSlot){
            throw new Error("Slot já bloqueado.");
        }

        const blockedSlot = await prisma.blockedSlot.create({
            data
        });

        return blockedSlot;

    }

    async findByProfessionalAndDate(professionalId: string, date: string){

        const professional = await prisma.professional.findUnique({
            where:{id: professionalId},
        });

        if(!professional){
            throw new Error("Profissional não encontrado.");
        }

        const blockedSlots = await prisma.blockedSlot.findMany({
            where:{
                professionalId: professionalId,
                date: new Date(date),
            },
            orderBy: {time: "asc"},
        });

        return blockedSlots;

    }

    async delete(id: string){

        const blockedSlot = await prisma.blockedSlot.findUnique({
            where: {id},
        });

        if(!blockedSlot){
            throw new Error("Slot bloqueado não encontrado.");
        }

        await prisma.blockedSlot.delete({
            where:{id},
        });

        return { message: "Slot bloqueado removido com sucesso." };

    }

}