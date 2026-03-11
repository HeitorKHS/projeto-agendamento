import { FastifyInstance } from "fastify";
import { AppointmentsController } from "./appointments.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const appointmentsController = new AppointmentsController();

export async function appointmentsRoutes(app: FastifyInstance){

    //Público
    app.get("/slots/:professionalId/:date", (req, reply) => appointmentsController.getAvaliableSlots(req, reply));

    //Cliente logado
    app.post("/", {preHandler: [authenticate]}, (req, reply) => appointmentsController.create(req, reply));
    app.get("/my", {preHandler: [authenticate]}, (req, reply) => appointmentsController.findByUser(req, reply));
    app.patch("/cancel/:id", {preHandler: [authenticate]}, (req, reply) => appointmentsController.cancel(req, reply));

    //Privado, apenas administrador
    app.get("/", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => appointmentsController.findAll(req, reply));
    app.patch("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => appointmentsController.update(req, reply));

}