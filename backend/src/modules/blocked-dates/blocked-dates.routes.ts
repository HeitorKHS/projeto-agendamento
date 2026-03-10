import { FastifyInstance } from "fastify";
import { BlockedDatesController } from "./blocked-dates.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const blockedDatesController = new BlockedDatesController();

export async function blockedDatesRoutes(app: FastifyInstance){

    //Público
    app.get("/:professionalId", (req, reply) => blockedDatesController.findByProfessional(req, reply));

    //Privado, apenas administrador
    app.post("/", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => blockedDatesController.create(req, reply));
    app.delete("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => blockedDatesController.delete(req,reply));

}