import { v4 as uuidv4 } from 'uuid';
import { ReceiveAction } from './actions/receive.js';
import WebSocket = require('ws');

class Session {
  private id: string
  constructor(private socket: WebSocket) {
    this.id = uuidv4();
  }

  getId() {
    return this.id;
  }

  handle(action: ReceiveAction) {
    switch (action.type) {
      case 'getId': {
        break;
      }
      case 'reuseId': {
        break;
      }
    }
  }

  sendJson(data: any) {
    this.socket.send(JSON.stringify(data))
  }

  informConnected() {
    
  }

  handleGetId() {
    this.socket.send
  }
}

export default Session;