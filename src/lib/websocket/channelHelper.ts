import { Message } from './actions/receive.js'
import { coreRedisClient } from './redis/createRedisClient.js'
import Session from './Session.js'

const withPrefix = (channel: string) => `channel:${channel}`
const channelHelper = {
  enter(channel: string, sessionId: string) {
    coreRedisClient.publish(
      withPrefix(channel),
      JSON.stringify({
        type: 'enter',
        sessionId: sessionId,
      })
    )
  },
  leave(channel: string, sessionId: string) {
    coreRedisClient.publish(
      withPrefix(channel),
      JSON.stringify({
        type: 'leave',
        sessionId: sessionId,
      })
    )
  },
  message(channel: string, sessionId: string, message: Message) {
    coreRedisClient.publish(
      withPrefix(channel),
      JSON.stringify({
        type: 'message',
        sessionId,
        message,
      })
    )
  },
}

export default channelHelper
