import z from "zod";

//Define as regras para os dados do registro de appointments
export const createAppointmentSchema = z.object({
    date: z.coerce.date(),
    time: z.string().regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido, use HH:MM"),
    serviceId: z.uuid("ID de serviço inválido"),
    professionalId: z.uuid("Identificação profissional inválida"),
});

export const updateAppointmentSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

//Cria tipos TypeScript automaticamente com base nos schemas
export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>;