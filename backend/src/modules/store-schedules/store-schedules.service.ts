import { prisma } from "../../lib/prisma";
import { CreateStoreScheduleSchema, UpdateStoreScheduleSchema } from "./store-schedules.schema";

export class StoreSchedulesService{

    async create(data: CreateStoreScheduleSchema){

        const storeSchedule = await prisma.storeSchedule.create({data});

        return storeSchedule;

    }

    async findAll(){

        const storeSchedules = await prisma.storeSchedule.findMany({
            orderBy:[
                {dayOfWeek: "asc"},
                {startTime: "asc"},
            ],
        });

        return storeSchedules;

    }

    async findById(id: string){

        const storeSchedule = await prisma.storeSchedule.findUnique({where: {id}});

        if(!storeSchedule){
            throw new Error("Agenda da loja não encontrada.");
        }

        return storeSchedule;

    }

    async findByDay(dayOfWeek: number){

        const storeSchedules = await prisma.storeSchedule.findMany({
            where: {dayOfWeek},
            orderBy: {startTime: "asc"},
        });

        return storeSchedules;

    }

    async update(id: string, data: UpdateStoreScheduleSchema){

        await this.findById(id);

        //Object.entries transforma o objeto em um array e o Object.fromEntries tranforma a array em objeto
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        const storeSchedule = await prisma.storeSchedule.update({
            where: {id},
            data: filteredData,
        });

        return storeSchedule;

    }

    async delete(id: string){

        await this.findById(id);

        await prisma.storeSchedule.delete({where:{id}});

        return { message: "Agenda da loja excluída com sucesso." };

    }

}