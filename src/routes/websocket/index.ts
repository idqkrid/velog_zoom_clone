import { FastifyPluginAsync } from "fastify";
import { isReceiveAction } from '../../lib/websocket/actions/receive.js'
import Session from '../../lib/websocket/Session.js'

const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const session = new Session(connection.socket)

    connection.socket.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString())
        if (!isReceiveAction(data)) return
        // logic
        session.handle(data)
      } catch (e) {
        console.log(e)
      }
    })
  })
}

export default websocket;