import '@fastify/jwt'
import { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (req: FastifyRequest, res: FastifyReply) => Promise<void>
  }
}