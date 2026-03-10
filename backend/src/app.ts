import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { servicesRoutes } from "./modules/services/services.routes";
import { professionalsRoutes } from "./modules/professionals/professionals.routes";
import { storeSchedulesRoutes } from "./modules/store-schedules/store-schedules.routes";
import { blockedDatesRoutes } from "./modules/blocked-dates/blocked-dates.routes";
import { blockedSlotsRoutes } from "./modules/blocked-slots/blocked-slots.routes";

export const app = Fastify({ logger: true });

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: "7d",
    },
});

//Routes
app.register(authRoutes, {prefix: "/auth"});
app.register(servicesRoutes, {prefix: "/services"});
app.register(professionalsRoutes, {prefix: "/professionals"});
app.register(storeSchedulesRoutes, {prefix: "/store-schedules"});
app.register(blockedDatesRoutes, {prefix: "/blocked-dates"});
app.register(blockedSlotsRoutes, {prefix: "/blocked-slots"});