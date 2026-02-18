import { prisma } from "./prisma";
import Fastify from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";

const app = Fastify({logger: true});

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

app.get('/check', async () => {
  return { status: 'ok' };
});

app.listen({port: 3000});