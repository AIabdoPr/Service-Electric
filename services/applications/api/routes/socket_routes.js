const Controller = require('../../../../lib/pkgs/controller');
const Routes = require('../../../../lib/pkgs/routes');
const SocketClient = require('../../../../lib/pkgs/socket_client');
const Environment = require('../../../../src/environment');
const UserModel = require('../../../models/user_model');
const ProductController = require('../controllers/product_controller');

class SocketRoutes extends Routes {

  constructor() {
    super('api', '/api');
    const SocketIO = require('socket.io');
    Environment.sockets.api = SocketIO(Environment.server, {
      path: '/api/api-socket/',
      cors: {
        origin: '*',
        allowEIO3: true,
      },
      allowEIO3: true,
    });
    Environment.sockets.api.on('connection', (client) => {
      if (Environment.socketClients.api == undefined) Environment.socketClients.api = {};
      Environment.socketClients.api[client.handshake.query.userId] = new SocketClient(client, 'api', new UserModel());
    });
    Environment.sockets.api.use(Environment.middlewares.api['jwt'].socketVerify);
  }

  setupRoutes() {
    Controller.setupListener('products', ProductController.onProductsUpdate);
    this.createSocketRoute('start-listener', (socketClient, eventName) => {
      try {
        socketClient.addEvent(`${eventName}s`);
        const Controller = require(`../controllers/${eventName}_controller`);
        Controller.sendData(socketClient);
      } catch (error) {
        console.log(error);
        // Log.error('SocketRoutes', `Error on start-listener: ${error}`);
      }
    });
    this.createSocketRoute('stop-listener', (socketClient, eventName) => {
      socketClient.removeEvent(`${eventName}s`);
    });

    this.createSocketRoute('create-product', (socketClient, productValues) => {
      ProductController.createProduct(socketClient, productValues);
    });

  }

}

module.exports = SocketRoutes;