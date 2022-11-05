const Routes = require("../../../../lib/pkgs/routes");
const Environment = require("../../../../src/environment");
const ProductController = require("../controllers/product_controller");
const UserController = require("../controllers/user_controller");

class ApiRoutes extends Routes {

  constructor() {
    super('api', '/api');
    Environment.addViewPath(__dirname + '/../views/api');
  }

  setupRoutes() {
    this.createRoute().post("/login").func(UserController.login);
    this.createRoute().post("/signup").func(UserController.signup);

    this.createRoute().post("/email_verification").func(UserController.emailVerification).middleware('jwt.emailVerification');
    this.createRoute().post("/password_forgot").func(UserController.passwordForgot);
    this.createRoute().post("/pf_email_verification").func(UserController.PFEmailVerification).middleware('jwt.PREmailVerification');
    this.createRoute().post("/password_reset").func(UserController.passwordReset).middleware('jwt.passwordReset');

    this.createRoute().get("/user").func(UserController.getUser).middleware('jwt.verify');
    this.createRoute().post('/create_product').func(ProductController.createProduct).middleware('jwt.verify')
    this.createRoute().post('/update_product').func(ProductController.updateProduct).middleware('jwt.verify')
    this.createRoute().get('/delete_product/:product_id').func(ProductController.deleteProduct).middleware('jwt.verify')
    this.createRoute().get('/product_image/:filename').func(ProductController.productImage).middleware('jwt.verify')
    this.createRoute().get("/logout").func(UserController.logout).middleware('jwt.verify');

    this.createRoute().post('/upload').func(ProductController.testuploadFile);

  }

}


module.exports = ApiRoutes;