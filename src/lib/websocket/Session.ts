import { v4 as uuidv4 } from 'uuid'
import { Message, ReceiveAction } from './actions/receive.js'
import WebSocket = require('ws')
import actionCreators from './actions/send.js'
import { createHmac } from 'crypto'
import subscription from './redis/Subscription.js'
import channelHelper from './channelHelper.js'

const { SESSION_SECRET_KEY } = process.env

if (!SESSION_SECRET_KEY) {
  console.warn('SESSION_SECRET_KEY is not defined')
}

class Session {
  id: string
  private token: string
  private currentChannel?: string | null = null

  constructor(private socket: WebSocket) {
    this.id = uuidv4()
    this.token = createHmac('sha256', SESSION_SECRET_KEY!)
      .update(this.id)
      .digest('hex')

    this.informConnected()
  }

  sendJson(data: any) {
    // EP3. 웹소켓 설정 30분 설명
    this.socket.send(JSON.stringify(data))
  }

  private informConnected() {
    const action = actionCreators.connected(this.id, this.token)
    this.sendJson(action)
  }

  handle(action: ReceiveAction) {
    switch (action.type) {
      case 'getId': {
        this.handleGetId()
        break
      }
      case 'reuseId': {
        break
      }
      case 'subscribe': {
        this.handleSubscribe(action.key)
        break
      }
      case 'unsubscribe': {
        this.handleUnsubscribe(action.key)
        break
      }
      case 'enter': {
        this.handleEnter(action.channel)
        break
      }
      case 'leave': {
        this.handleLeave()
        break
      }
      case 'message': {
        this.handleMessage(action.message)
        break
      }
    }
  }

  private handleGetId() {
    // 세번째 1시간 2분
    const action = actionCreators.getIdSuccess(this.id)
    this.sendJson(action)
  }

  private handleSubscribe(key: string) {
    subscription.subscribe(key, this)
    const action = actionCreators.SubscriptionSuccess(key)
    this.sendJson(action)
  }

  private handleUnsubscribe(key: string) {
    subscription.unsubscribe(key, this)
  }

  private handleEnter(channel: string) {
    subscription.subscribe(`channel:${channel}`, this)
    channelHelper.enter(channel, this.id)
    this.currentChannel = channel
  }
  private handleLeave() {
    if (!this.currentChannel) return
    subscription.unsubscribe(`channel: ${this.currentChannel}`, this)
    channelHelper.leave(this.currentChannel, this.id)
    this.currentChannel = null
  }

  private handleMessage(message: Message) {
    if (!this.currentChannel) return
    channelHelper.message(this.currentChannel, this.id, message)
  }

  public sendSubscriptionMessage(key: string, message: any) {
    const action = actionCreators.subscriptionMessage(key, message)
    this.sendJson(action)
  }
}

export default Session
