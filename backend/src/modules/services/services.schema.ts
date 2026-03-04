import z from "zod";

//Define as regras para os dados do registro de serviço
export const createServiceSchema = z.object({
    name: z.string().min(5, "O nome deve ter pelo menos 5 caracteres."),
    description: z.string().optional(),
    price: z.number().positive("O preço deve ser positivo."),
    duration: z.number().int().positive("A duração deve ser positiva."),
});

//.partial transforma todos os campos em opcionais.
export const updateServiceSchema = createServiceSchema.partial();

//Cria tipos TypeScript automaticamente com base nos schemas
export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;