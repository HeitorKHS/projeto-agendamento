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

app.get('/check', async () => {
  return { status: 'ok' };
});

app.listen({port: 3000});