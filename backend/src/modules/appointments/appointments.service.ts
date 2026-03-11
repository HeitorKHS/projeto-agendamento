import { prisma } from "../../lib/prisma";
import { CreateAppointmentSchema, UpdateAppointmentSchema } from "./appointments.schema";

export class AppointmentsService{

    async create(data: CreateAppointmentSchema, userId: string){

        const [service, professional] = await Promise.all([
            prisma.service.findUnique({where: {id: data.serviceId}}),
            prisma.professional.findUnique({where: {id: data.professionalId}}),
        ]);

        if(!service){
            throw new Error("Serviço não encontrado.");
        }

        if(!professional){
            throw new Error("Profissional não encontrado.");
        }

        const [isDateBlocked, isSlotBlocked, conflictingAppointment] = await Promise.all([
            prisma.blockedDate.findFirst({
                where:{
                    professionalId: data.professionalId,
                    date: data.date,
                },
            }),
            prisma.blockedSlot.findFirst({
                where:{
                    professionalId: data.professionalId,
                    date: data.date,
                    time: data.time,
                },
            }),
            prisma.appointment.findFirst({
                where:{
                    professionalId: data.professionalId,
                    date: data.date,
                    time: data.time,
                    status: {not: "CANCELLED"},
                },
            }),
        ]);

        if(isDateBlocked){
            throw new Error("O profissional não está disponível nesta data.");
        }

        if(isSlotBlocked){
            throw new Error("Este horário não está disponível.");
        }

        if(conflictingAppointment){
            throw new Error("O profissional já tem um horário agendado neste momento.");
        }

        const appointment = await prisma.appointment.create({
            data:{
                date: data.date,
                time: data.time,
                userId,
                serviceId: data.serviceId,
                professionalId: data.professionalId,
            },
            include:{
                service: true,
                professional: true,
                user:{
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return appointment;

    }

    async getAvaliableSlots(professionalId: string, date: string){

        const appointmentDate = new Date(date);
        const dayOfWeek = appointmentDate.getDay();

        const [storeSchedules, isDateBlocked, blockedSlots, existingAppointments] = await Promise.all([
            prisma.storeSchedule.findMany({
                where:{dayOfWeek},
                orderBy: {startTime: "asc"},
            }),
            prisma.blockedDate.findFirst({
                where:{
                    professionalId,
                    date: appointmentDate,
                },
            }),
            prisma.blockedSlot.findMany({
                where:{
                    professionalId,
                    date: appointmentDate,
                },
            }),
            prisma.appointment.findMany({
                where:{
                    professionalId,
                    date: appointmentDate,
                    status: {not: "CANCELLED"},
                },
            }),
        ]);

        //Se storeSchedules for vazio e isDateBlocked for true, retorna um objeto dizendo não disponpível e uma array vazia
        if(storeSchedules.length === 0 || isDateBlocked){
            return {available: false, slots: []};
        }

        //Transforma a array blockedSlots e transforma em uma array só de horários blockedSlots = [ { time: "09:00" }, { time: "10:00" }, { time: "11:00" }] para ["09:00", "10:00", "11:00"]
        const blockedSet = new Set(blockedSlots.map((s) => s.time))
        //Faz a mesma coisa que o blockedSlots porém com os horários já ocupados por agendamentos.
        const occupiedSet = new Set(existingAppointments.map((a) => a.time))

        // Gera slots de 30 em 30 minutos para cada período da loja
        const slots: {time: string; available: boolean}[] = [];

        for(const schedule of storeSchedules){

            //Pega o horário por exemplo 09:30 e o split separa essa string para startHour = 09 e startMinute = 30 e o map transforma em número
            const [startHourStr, startMinuteStr] = schedule.startTime.split(":");
            const [endHourStr, endMinuteStr] = schedule.endTime.split(":");
            const startHour = Number(startHourStr ?? 0);
            const startMinute = Number(startMinuteStr ?? 0);
            const endHour = Number(endHourStr ?? 0);
            const endMinute = Number(endMinuteStr ?? 0);

            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;

            for(let time = startTime; time < endTime; time += 30){

                const hour = Math.floor(time /60);
                const minute = time % 60;

                //Transforma em uma string,se a string não tiver 2 caracteres ele coloca 0 à esquerda
                const slotTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

                slots.push({
                    time: slotTime,
                    available: !blockedSet.has(slotTime) && !occupiedSet.has(slotTime),
                });

            }

            return { available: true, slots };

        }

    }

    async findAll(){

        const appointments = await prisma.appointment.findMany({
            include:{
                user: {select: { id: true, name: true, email: true }},
                service: true,
                professional: true,
            },
            orderBy: {date: "asc"},
        });

        return appointments;

    }

    async findByUser(userId: string){

        const appointments = await prisma.appointment.findMany({
            where:{userId},
            include:{
                service: true,
                professional: true,
            },
            orderBy:{date: "asc"},
        });

        return appointments;

    }

    async cancel(id: string, userId: string, role: string){

        const appointment = await prisma.appointment.findUnique({where: {id}});

        if(!appointment){
            throw new Error("Agendamento não encontrado.");
        }

        if(role === "CLIENT" && appointment.userId !== userId){
            throw new Error("Não autorizado.");
        }

        if(appointment.status === "CANCELLED"){
            throw new Error("Consulta já cancelada.");
        }

        if(role !== "ADMIN"){
            const now = new Date();
            const appointmentDate = new Date(appointment.date);
            const diffInHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

            if(diffInHours < 12){
                throw new Error("O agendamento só pode ser cancelado com 12 horas de antecedência.");
            }
        }

        const cancelled = await prisma.appointment.update({
            where: {id},
            data: { status: "CANCELLED" },
        });

        return cancelled;

    }

    async update(id: string, data: UpdateAppointmentSchema){

        const appointment = await prisma.appointment.findUnique({where: {id}});

        if(!appointment){
            throw new Error("Agendamento não encontrado.");
        }

        const updated = await prisma.appointment.update({
            where: {id},
            data,
        });

        return updated;

    }

}