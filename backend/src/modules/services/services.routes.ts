import { FastifyInstance } from "fastify"; //Tipo que representa o servidor Fastify
import { ServicesController } from "./services.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const servicesController = new ServicesController();

export async function servicesRoutes(app: FastifyInstance){

    //Público
    app.get("/", (req, reply) => servicesController.findAll(req, reply));
    app.get("/:id", (req, reply) => servicesController.findById(req, reply));

    //Privado, apenas administrador
    app.post("/", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => servicesController.create(req, reply));
    app.put("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => servicesController.update(req, reply));
    app.delete("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => servicesController.delete(req, reply));

}