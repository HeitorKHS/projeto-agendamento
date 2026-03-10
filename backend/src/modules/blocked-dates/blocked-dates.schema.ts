import z from "zod";

//Define as regras para os dados do registro de blocked date
export const createBlockedDateSchema = z.object({
    date: z.coerce.date("Formato de data inválido"),
    reason: z.string().optional(),
    professionalId: z.uuid("Identificação profissional inválida"),
});

//Cria tipos TypeScript automaticamente com base nos schemas
export type CreateBlockedDateSchema = z.infer<typeof createBlockedDateSchema>;