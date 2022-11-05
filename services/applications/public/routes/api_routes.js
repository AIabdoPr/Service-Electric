const Routes = require("../../../../lib/pkgs/routes");
const Environment = require("../../../../src/environment");
const UserController = require("../controllers/user_controller");

class ApiRoutes extends Routes {

  constructor() {
    super('public', '');
    Environment.addViewPath(`${__dirname}/../views`);
  }

  setupRoutes() {
    this.createApiRoute().get('/').func(UserController.index);
    
    // this.createApiRoute().post('/').func(UserController.index);
    // this.createApiRoute().get('/set-password/:token').func(UserController.setPassword);
    // this.createApiRoute().post('/set-password/:token').func(UserController.setPassword);
  }

}


module.exports = ApiRoutes;