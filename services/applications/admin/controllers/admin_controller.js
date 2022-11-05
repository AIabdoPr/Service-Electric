const bcrypt = require('bcrypt');
const JWTAuth = require('../../../../lib/pkgs/jwt_auth');
const Log = require('../../../../lib/pkgs/log');
const AdminModel = require('../../../models/admin_model');
// const FamilyController = require('./family_controller');
const CryptoJS = require("crypto-js");
const UserModel = require('../../../models/user_model');

class AdminController {

  static async loginView(request, response) {
    if (request.cookies.adminAuth && await JWTAuth.verify(request.cookies.adminAuth)) {
      return response.redirect(`${request.getRequestHostUrl()}/admin`);
    }
    return response.render('admin/pages/login', {
      validates: {},
      values: {}
    });
  }

  static async login(request, response) {
    if (request.cookies.adminAuth && await JWTAuth.verify(request.cookies.adminAuth)) {
      return response.redirect(`${request.getRequestHostUrl()}/admin`);
    }
    var validates = {};
    var values = {
      email: '',
      password: '',
      remember_me: request.remember_me ? true : false,
    }
    if (request.email == undefined || request.email == '') {
      validates.email = 'The email is required';
    } else {
      values.email = request.email;
    }
    if (request.password == undefined || request.password == '') {
      validates.password = 'The password is required';
    } else {
      values.password = request.password;
    }
    
    if (values.email != null && values.password != '') {
      var user = await new UserModel().find(request.email, 'email');
      if (user) {
        var admin = await new AdminModel().find(user.id, 'user_id');
        if (await bcrypt.compare(request.password, admin.password)) {
          var token = await JWTAuth.sign({ userId: admin.id, email: request.email }, admin.id, 'admin', 'sign', values.remember_me);
          if (token) {
            Log.log('AdminAuth', 'successfully login', {
              admin_id: admin.id,
              authToken: token,
            });
            response.cookie('adminAuth', token);
            request.session.loggedin = true;
            return response.redirect(`${request.getRequestHostUrl()}/admin`);
          } else {
            Log.warninig('AdminAuth', 'unsuccessfully login', {
              admin_id: admin.id,
              requestData: request.allData,
            });
            validates.email = 'Invalid email';
            validates.password = 'Invalid password';
          }
        } else {
          Log.warninig('AdminAuth', 'Invaliable email or password', {
            admin_id: admin != undefined ? admin.id : undefined,
            requestData: request.allData,
          });
          validates.password = 'Invalid password';
        }
      } else {
        Log.warninig('AdminAuth', 'Invaliable email or password', {
          admin_id: admin != undefined ? admin.id : undefined,
          requestData: request.allData,
        });
        validates.email = 'Invalid email';
      }
    }
    return response.render('admin/pages/login', {
      validates: validates,
      values: values,
    });
  }

  // static async index(request, response) {
  //   var cryptoPermissions = CryptoJS.AES.encrypt(JSON.stringify(request.user.permissions), request.cookies.adminAuth).toString();
  //   return response.render('admin/pages/index', {
  //     admin: request.user,
  //     families:  await FamilyController.filterFamilies(await FamilyController.getAll(), 'insert', false),
  //     cryptoPermissions: cryptoPermissions
  //   });
  // }

  static async logout(request, response) {
    var signout = await JWTAuth.signout(request.cookies.adminAuth);
    if (signout.success) {
      response.response.clearCookie('adminAuth');
    } else {
      console.log(signout.message)
    }
    return response.redirect(`${request.getRequestHostUrl()}/admin/login`);
  }

}

module.exports = AdminController;