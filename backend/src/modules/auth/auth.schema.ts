import z from "zod";

//Define as regras para os dados do registro de usuário
export const registerSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

//Define as regras para os dados de login de usuário
export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

//Cria tipos TypeScript automaticamente com base nos schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;