import z from "zod";

export const baseStoreScheduleSchema = z.object({
    dayOfWeek: z.number().int().min(0).max(6, "O dia da semana deve estar entre 0 e 6."),
    startTime: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido, use HH:MM."),
    endTime: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido, use HH:MM."),
})

//Refine, validação customizada do Zod que garante que o startTime é sempre menor que o endTime
export const createStoreScheduleSchema = baseStoreScheduleSchema.refine(
    (data) => data.startTime < data.endTime, {message: "O horário de início deve ser antes do horário de término",}
);

export const updateStoreScheduleSchema = baseStoreScheduleSchema.partial().refine(
  (data) => {
    // No update, só validamos se AMBOS os campos existirem
    if (data.startTime && data.endTime) {
      return data.startTime < data.endTime;
    }
    return true;
  },
  { message: "O horário de início deve ser antes do horário de término"},
);

export type CreateStoreScheduleSchema = z.infer<typeof createStoreScheduleSchema>;
export type UpdateStoreScheduleSchema = z.infer<typeof updateStoreScheduleSchema>;

