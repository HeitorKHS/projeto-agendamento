import z from "zod";

//Define as regras para os dados do registro de profissional
export const createProfessionalSchema = z.object({
    name: z.string().min(1, "O nome deve ter pelo menos 1 caracteres."),
    phone: z.string().optional(),
    bio: z.string().optional(),
});

//.partial transforma todos os campos em opcionais.
export const updateProfessionalSchema = createProfessionalSchema.partial();

//Cria tipos TypeScript automaticamente com base nos schemas
export type CreateProfessionalSchema = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalSchema = z.infer<typeof updateProfessionalSchema>;