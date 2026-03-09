import { FastifyInstance } from "fastify/types/instance";
import { StoreSchedulesController } from "./store-schedules.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const storeSchedulesController = new StoreSchedulesController();

export function storeSchedulesRoutes(app: FastifyInstance){

    //Pública
    app.get("/", (req, reply) => storeSchedulesController.findAll(req, reply));
    app.get("/:id", (req, reply) => storeSchedulesController.findById(req, reply));
    app.get("/day/:dayOfWeek", (req, reply) => storeSchedulesController.findByDay(req, reply));

    //Privado, apenas administrador
    app.post("/", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => storeSchedulesController.create(req, reply));
    app.put("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => storeSchedulesController.update(req, reply));
    app.delete("/:id", {preHandler: [authenticate, authorize("ADMIN")]}, (req, reply) => storeSchedulesController.delete(req, reply));

}