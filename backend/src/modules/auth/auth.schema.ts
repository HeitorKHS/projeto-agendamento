import z from "zod";

//Define as regras para os dados do registro de usuário
export const registerSchema = z.object({
    name: z.string().min(5, "O nome deve ter pelo menos 5 caracteres."),
    email: z.email("E-mail inválido."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

//Define as regras para os dados de login de usuário
export const loginSchema = z.object({
    email: z.email("E-mail inválido."),
    password: z.string().min(1, "A senha é obrigatória."),
});

//Cria tipos TypeScript automaticamente com base nos schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;