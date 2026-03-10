import z from "zod";

export const createBlockedDateSchema = z.object({
    date: z.coerce.date("Formato de data inválido"),
    reason: z.string().optional(),
    professionalId: z.uuid("Identificação profissional inválida"),
});

export type CreateBlockedDateSchema = z.infer<typeof createBlockedDateSchema>;