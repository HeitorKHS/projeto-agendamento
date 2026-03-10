import { FastifyInstance } from "fastify";
import { BlockedSlotsController } from "./blocked-slots.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const blockedSlotsController = new BlockedSlotsController();

export async function blockedSlotsRoutes(app: FastifyInstance){

    //Público
    app.get("/professional/:professionalId/date/:date", (req, reply) => blockedSlotsController.findByProfessionalAndDate(req, reply));

    //Privado, apenas administrador
    app.post("/", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => blockedSlotsController.create(req, reply));
    app.delete("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => blockedSlotsController.delete(req, reply));

}