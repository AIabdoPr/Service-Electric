const Routes = require('../../../../lib/pkgs/routes');
const Environment = require('../../../../src/environment');
const AdminController = require('../controllers/admin_controller');

class ApiRoutes extends Routes {

  constructor() {
    super('admin', '/admin');
    Environment.addViewPath(`${__dirname}/../views`);
  }

  setupRoutes() {

    // this.createRoute().get('/login').func(AdminController.loginView);
    // this.createRoute().post('/login').func(AdminController.login);

    // var middlewaredGroup = this.createGroup('').middleware('jwt');
    // middlewaredGroup.createRoute().get('/').func(AdminController.index);
    // middlewaredGroup.createRoute().get('/logout').func(AdminController.logout);

  }

}


module.exports = ApiRoutes;