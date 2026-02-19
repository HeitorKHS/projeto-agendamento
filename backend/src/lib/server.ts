import { prisma } from "./prisma";
import Fastify from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from '@fastify/jwt'
import "dotenv/config";

const app = Fastify({logger: true});

app.register(jwt, {
  secret: `${process.env.JWT_SECRET}`,
})

app.decorate("authenticate", async (req, res) => {
  try {
    await req.jwtVerify()
  } catch (err) {
    res.status(401).send({ message: "Token inválido ou ausente!" })
  }
})

app.post("/users", async (req, res) => {

    const createUserSchema = z.object({
        name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
        email: z.email("E-mail inválido"),
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    });

    try {

        const {name, email, password} = createUserSchema.parse(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).send({ userId: user.id });

    } catch(error:any){

        if(error instanceof z.ZodError){
            return res.status(400).send({ errors: error.flatten });
        }

        if(error.code === "p2002"){
            return res.status(400).send({ message: "Este e-mail já está em uso." });
        }

        return res.status(500).send({ message: "Erro interno no servidor." });

    }

});

//Create appointments
app.post("/appointments", async (req, res) => {

    const createAppointmentSchema = z.object({
        userId: z.uuid(),
        date: z.string(),
    });

    try {

        const {userId, date} = createAppointmentSchema.parse(req.body);

        const appointmentDate = new Date(date);

        //reset minutes, seconds, and milliseconds (for hourly scheduling)
        appointmentDate.setMinutes(0, 0, 0);

        //check if the date is invalid
        if(isNaN(appointmentDate.getTime())){
            return res.status(400).send({ message: "Formato de data inválido." })
        }

        //Check if the date is in the past.
        const now = new Date();
        if(appointmentDate < now) {
            return res.status(400).send({ message: "Você não pode agendar no passado." });
        }

        //Check for conflicts in the database
        const conflictingAppointment = await prisma.appointment.findFirst({
            where: {
                date: appointmentDate,
            },
        });

        if(conflictingAppointment){
            return res.status(400).send({ message: "Este horário já está ocupado." })
        }

        const appointment = await prisma.appointment.create({
            data:{
                userId,
                date: appointmentDate,
            },
        });

        return res.status(201).send(appointment);

    } catch(error:any){

        if(error instanceof z.ZodError){
            return res.status(400).send({ errors: error.flatten });
        }

        return res.status(500).send({ message: "Erro interno no servidor." });
        
    }

});

//Returns all of the user's appointments
app.get("/appointments/:userId", async (req, res) => {

    const getParamsSchema = z.object({
        userId: z.uuid(),
    });

    try {

        const { userId } = getParamsSchema.parse(req.params);

        const appointments = prisma.appointment.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                date: "asc",
            },
        });

        return appointments;

    } catch(error:any){

        return res.status(400).send({ message: "ID de usuário inválido." });

    }

})

//Delete the appointment
app.delete("/appointments/:id", async (req, res) => {
    
    const getParamsSchema = z.object({
        id: z.uuid(),
    });
    
    try {

        const { id } = getParamsSchema.parse(req.params);

        await prisma.appointment.delete({
            where: {id},
        });

        return res.status(204).send();

    } catch(error:any){

        if(error.code === "P2025"){
            return res.status(404).send({ message: "Agendamento não encontrado." })
        }

        return res.status(400).send({ message: "ID inválido." })

    }

})

app.get("/calendar", async (req, res) => {

    const querySchema = z.object({
        date: z.string(),
    });

    try {

        const { date } = querySchema.parse(req.query);

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'asc',
            },
        });

        return appointments;

    } catch(error){
        
        return res.status(400).send({ message: "Data inválida ou não fornecida." });
  
    }

})

// POST /services (Only ADMIN)
app.post("/services", { preHandler: [app.authenticate] }, async (req, res) => {

    const serviceSchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        duration: z.number(),
    });

    try {

        const user = req.user as {role: string};
        if(user.role !== 'ADMIN'){
            return res.status(403).send({ message: "Apenas administradores podem criar serviços." });
        }

        const { name, description, price, duration } = serviceSchema.parse(req.body);

        const service = await prisma.service.create({
            data: {
                name,
                description: description ?? null,
                price,
                duration,
            }
        })

        return res.status(201).send(service);

    } catch(error:any){

        return res.status(400).send({ message: "Erro ao criar serviço." });

    }

})

// GET /services
app.get("/services", async (req, res) => {

    const services = await prisma.service.findMany();
    return services;

})



app.get("/check", async () => {
  return { status: 'ok' };
});

app.listen({port: 3000});