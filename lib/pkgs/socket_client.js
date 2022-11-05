const Environment = require('../../src/environment');
const Log = require('./log');

class SocketClient {

  socket;
  appId = '';
  id;
  events = [];
  onFuncs = [];
  lastRequestId;
  lastRequestArgs;
  userModel;
  user;
  userId;

  constructor(socket, appId, userModel) {
    this.socket = socket;
    this.appId = appId;
    this.userModel = userModel;
    this.userId = this.socket.handshake.query.userId;
    Log.log('SocketLog', 'client connected', {
      clientId: this.userId,
      socketId: this.socket.id,
    });
    userModel.find(this.userId, 'id', true, true).then((user) => {
      this.user = user;
    });
    this.emit('auth', 'connected');
    console.log(this.userId, 'connected');
    this.on('disconnect', () => {
      this.disconnect();
    });
    this._bindEvents();
  }

  addEvent(eventName) {
    if (this.events.indexOf(eventName) == -1) {
      this.events.push(eventName);
    }
  }

  removeEvent(eventName) {
    if (this.events.indexOf(eventName) != -1) {
      this.events.pop(this.events.indexOf(eventName));
    }
  }

  on(funcName, func, ...args) {
    if (this.onFuncs.indexOf(funcName) == -1) {
      this.socket.on(
        funcName, (...args) => {
          try {
            func(...args);
          } catch (error) {
            console.log(`ERROR(${funcName}): ${error}`);
          }
        },
        ...args
      );
    }
  }

  emit(eventName, ...args) {
    this.socket.emit(
      eventName,
      `${eventName}<->${Date.now().toString()}`,
      ...args
    );
  }

  disconnect() {
    Log.log('SocketLog', 'client disconnected', {
      clientId: this.userId,
      socketId: this.socket.id,
    });
    console.log(this.userId, 'disconnect');
    this.socket.disconnect();
    delete(this);
  }

  _renderRequestId(reqId) {
    var splitReqId = reqId.split('<->')
    return {
      eventName: splitReqId[0],
      time: splitReqId[1],
    }
  }

  _bindEvents() {
    if(Environment.socketEvents[this.appId]) {
      //console.log(Environment.socketEvents[this.appId]);
      Environment.socketEvents[this.appId].forEach(socketEvent => {
        // this.on(socketEvent.event, (reqId, ...args) => {
        this.on(socketEvent.event, async (...args) => {
          // reqId = this._renderRequestId(reqId);
          // if (this.lastRequestId != undefined) {
          //   if (this.lastRequestId.eventName == reqId.eventName &&
          //       this.lastRequestArgs == args &&
          //       reqId.time - this.lastRequestId.time <= 150) {
          //     console.log('repeative request', Date.now(), reqId, ...args);
          //     return;
          //   }
          // }
          // this.lastRequestId = reqId;
          // this.lastRequestArgs = args;
          this.user = await this.userModel.find(this.userId, 'id', true, true);
          socketEvent.func(this, ...args);
        });
      });
    }
  }

}

module.exports = SocketClient;