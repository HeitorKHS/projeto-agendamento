import z from "zod";

//Define as regras para os dados do registro de blocked slot
export const createBlockedSlotSchema = z.object({
    date: z.coerce.date(),
    time: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido, use HH:MM"),
    professionalId: z.uuid(),
});

//Cria tipos TypeScript automaticamente com base nos schemas
export type CreateBlockedSlotSchema = z.infer<typeof createBlockedSlotSchema>;