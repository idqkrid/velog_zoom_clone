import { FastifyPluginAsync } from "fastify";
import { isReceiveAction } from "./lib/actions/receive.js";
import Session from "./lib/Session.js";

const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const session = new Session(connection.socket);

    connection.socket.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString())
          if (!isReceiveAction(data)) return
          // logic
          
        } catch (e) {
          
        } 
      })
  });
}

export default websocket;