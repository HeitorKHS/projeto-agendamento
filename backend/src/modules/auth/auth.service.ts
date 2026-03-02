import { prisma } from "../../lib/prisma";
import { RegisterInput, LoginInput } from "./auth.schema";
import bcrypt from "bcryptjs";

export class AuthService{

    async register(data: RegisterInput){

        const userExists = await prisma.user.findUnique({where: {email: data.email}});

        if(userExists){
            throw new Error("E-mail já em uso.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data:{
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
        });

        return user.id;

    }

    async login(data: LoginInput){

        const user = await prisma.user.findUnique({where: {email: data.email}});

        if(!user){
            throw new Error("E-mail ou senha inválidos.");
        }

        const isValidPassword = await bcrypt.compare(data.password, user.password);

        if(!isValidPassword){
            throw new Error("E-mail ou senha inválidos.");
        }

        return user;

    }

}