import { FastifyRequest, FastifyReply } from "fastify";
import { AppointmentsService } from "./appointments.service";
import { createAppointmentSchema, updateAppointmentSchema } from "./appointments.schema";

const appointmentsService = new AppointmentsService();

export class AppointmentsController{

    async create(req: FastifyRequest, reply: FastifyReply){

        try{

            const body = createAppointmentSchema.parse(req.body);
            const { sub } = req.user as {sub: string, role:string}
            const appointment = await appointmentsService.create(body, sub);
            return reply.status(201).send(appointment);

        } catch(error: any){

            if(error.message === "Serviço não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            if(error.message === "Profissional não encontrado."){
                return reply.status(404).send({ message: error.message });
            }

            if(error.message === "O profissional não está disponível nesta data."){
                return reply.status(400).send({ message: error.message });
            }

            if(error.message === "Este horário não está disponível."){
                return reply.status(400).send({ message: error.message });
            }

            if(error.message === "O profissional já tem um horário agendado neste momento."){
                return reply.status(404).send({ message: error.message });
            }

            if(error?.issues){
                return reply.status(400).send({ message: error?.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async getAvaliableSlots(req: FastifyRequest, reply: FastifyReply){

        try{

            const { professionalId, date } = req.params as { professionalId: string, date: string };
            const slots = await appointmentsService.getAvaliableSlots(professionalId, date);
            return reply.status(200).send(slots);

        } catch(error:any){

            return reply.status(500).send("Erro do Servidor Interno.");

        }

    }

    async findAll(req: FastifyRequest, reply: FastifyReply){

        try{

            const appointments = await appointmentsService.findAll();
            return reply.status(200).send(appointments);

        } catch(error:any){

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async findByUser(req: FastifyRequest, reply: FastifyReply){

        try{

            const { sub } = req.user as { sub: string, role: string };
            const appointments = await appointmentsService.findByUser(sub);
            return reply.status(200).send(appointments);

        } catch(error:any){

            return reply.status(500).send({ message: "Erro do Servidor Intenro." });

        }

    }

    async cancel(req: FastifyRequest, reply: FastifyReply){

        try{

            const { id } = req.params as {id: string};
            const { sub, role } = req.user as {sub: string, role:string};
            const appointment = await appointmentsService.cancel(id, sub, role);
            return reply.status(200).send(appointment);

        } catch(error:any){

            if (error.message === "Agendamento não encontrado.") {
                return reply.status(404).send({ message: error.message });
            }

            if (error.message === "Não autorizado.") {
                return reply.status(401).send({ message: error.message });
            }

            if (error.message === "Consulta já cancelada.") {
                return reply.status(409).send({ message: error.message });
            }

            if (error.message === "O agendamento só pode ser cancelado com 12 horas de antecedência.") {
                return reply.status(400).send({ message: error.message });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

    async update(req: FastifyRequest, reply: FastifyReply){

        try{

            const {id} = req.params as {id: string};
            const body = updateAppointmentSchema.parse(req.body);
            const appointment = await appointmentsService.update(id, body);
            return reply.status(200).send(appointment);

        } catch(error:any){

            if (error.message === "Agendamento não encontrado.") {
                return reply.status(404).send({ message: error.message });
            }

            if (error?.issues) {
                return reply.status(400).send({ message: error.issues });
            }

            return reply.status(500).send({ message: "Erro do Servidor Interno." });

        }

    }

}