import { v4 as uuidv4 } from 'uuid'
import { ReceiveAction } from './actions/receive.js'
import WebSocket = require('ws')
import actionCreators from './actions/send.js'
import { createHmac } from 'crypto'

const { SESSION_SECRET_KEY } = process.env

if (!SESSION_SECRET_KEY) {
  console.warn('SESSION_SECRET_KEY is not defined')
}

class Session {
  private id: string
  private token: string

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
        break
      }
      case 'unsubscribe': {
        break
      }
    }
  }

  private handleGetId() {
    // 세번째 1시간 2분
    const action = actionCreators.getIdSuccess(this.id)
    this.sendJson(action)
  }
}

export default Session
