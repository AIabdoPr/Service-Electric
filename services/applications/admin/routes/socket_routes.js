const Controller = require('../../../../lib/pkgs/controller');
const Log = require('../../../../lib/pkgs/log');
const Routes = require('../../../../lib/pkgs/routes');
const SocketClient = require('../../../../lib/pkgs/socket_client');
const Environment = require('../../../../src/environment');
const AdminModel = require('../../../models/admin_model');
const AdminController = require('../controllers/admin_controller');
const UserController = require('../controllers/user_controller');

class SocketRoutes extends Routes {

  constructor() {
    super('admin', '');
    const SocketIO = require('socket.io');
    Environment.sockets.admin = SocketIO(Environment.server, {
      path: '/admin/admin-socket/',
      cors: {
        origin: '*',
        allowEIO3: true,
      },
      allowEIO3: true,
    });
    Environment.sockets.admin.on('connection', (client) => {
      if (Environment.socketClients.admin == undefined) Environment.socketClients.admin = {};
      Environment.socketClients.admin[client.handshake.query.userId] = new SocketClient(client, 'admin', new AdminModel());
    });
    Environment.sockets.admin.use(Environment.middlewares.admin['socket-jwt']);
  }

  setupRoutes() {
    return;
    Controller.setupListener('users', UserController.onUsersUpdate);
    this.createSocketRoute('start-listener', (socketClient, eventName) => {
      // try {
        socketClient.addEvent(`${eventName}s`);
        const Controller = require(`../controllers/${eventName}_controller`);
        Controller.sendData(socketClient);
      // } catch (error) {
      //   Log.error('SocketRoutes', `Error on start-listener: ${error}`);
      // }
    });
    this.createSocketRoute('stop-listener', (socketClient, eventName) => {
      socketClient.removeEvent(`${eventName}s`);
    });

    this.createSocketRoute('create-user', (socketClient, userValues) => {
      UserController.createUser(socketClient, userValues);
    });

    this.createSocketRoute('update-user', (socketClient, userValues) => {
      UserController.updateUser(socketClient, userValues);
    });

    this.createSocketRoute('delete-user', (socketClient, userId) => {
      UserController.deleteUser(socketClient, userId);
    });
    this.createSocketRoute('delete-users', (socketClient, userId) => {
      UserController.deleteUsers(socketClient, userId);
    });
  }

}

module.exports = SocketRoutes;