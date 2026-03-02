import fastifyJwt from "@fastify/jwt";
import Fastify from "fastify";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";

export const app = Fastify({ logger: true });

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: "7d",
    },
});

//Routes
app.register(authRoutes, {prefix: "/auth"});