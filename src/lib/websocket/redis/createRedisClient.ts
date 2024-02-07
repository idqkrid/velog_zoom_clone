import redis from 'redis'

const createRedisClient = () => {
  return redis.createClient()
}

export const coreRedisClient = createRedisClient()

// this subscriber is used for sessions
export const globalSubscriber = createRedisClient()
