import { FastifyInstance } from "fastify/types/instance";
import { ProfessionalsController } from "./professionals.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const professionalsController = new ProfessionalsController();

export async function professionalsRoutes(app: FastifyInstance){

    //Público
    app.get("/", (req, reply) => professionalsController.findAll(req, reply));
    app.get("/:id", (req, reply) => professionalsController.findById(req, reply));

    //Privado, apenas administrador
    app.post("/", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => professionalsController.create(req, reply));
    app.put("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => professionalsController.update(req, reply));
    app.delete("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => professionalsController.delete(req, reply));

}