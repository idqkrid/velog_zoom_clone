import fp from 'fastify-plugin';
import fastifyWebsocket from '@fastify/websocket';

export default fp(async (fastify: any, opts: any) => {
  console.log('hello');
  fastify.register(fastifyWebsocket);
})