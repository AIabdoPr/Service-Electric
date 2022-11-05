const AccountModel = require("../../../models/account_model");
const UserModel = require("../../../models/user_model");
const JWTAuth = require('../../../../lib/pkgs/jwt_auth');
const bcrypt = require('bcrypt');

class UserController {

  static async index(request, response) {
    console.log('here');
    return response.json({
      'success': true,
    });
    var validates = {};
    var values = {
      email: '',
      phone: '',
      check_type: request.check_type,
    }


    var alertMessages = [];
    if (request.type === 'POST') {
      if (values.check_type == 'email') {
        if (request.email == undefined || request.email == '') {
          validates.email = 'البريد الإلكتروني مطلوب.';
        } else {
          values.email = request.email;
          var user = await new UserModel().find(request.email, 'email');
          if(user) {
            var account = await new AccountModel().find(user.id, 'user_id');
            if(account) {
              alertMessages.push({
                success: false,
                type: 'danger',
                message: 'لديك حساب بالفعل، يرجى تسجيل الدخول مباشرة.',
              });
            } else {
              var accountId = (await new AccountModel().create({user_id: user.id})).insertId;
              var token = JWTAuth.sign({userId: accountId}, accountId, 'account', 'verify');
              // send email with token
              // TODO: create script to send email

              alertMessages.push({
                success: true,
                type: 'success',
                message: 'تم إرسال رابط التحقق إلى البريد الإلكتروني الخاص بك.',
              });
            }
          } else {
            validates.email = 'البريد الإلكتروني خاطأ.';
          }
        }
      } else if (values.check_type == 'phone') {
        if (request.phone == undefined || request.phone == '') {
          validates.phone = 'رقم الهاتف مطلوب.';
        } else {
          values.phone = request.phone;
          var user = await new UserModel().find(request.phone, 'phone');
          if(user) {
            var account = await new AccountModel().find(user.id, 'user_id');
            if(account) {
              alertMessages.push({
                success: false,
                type: 'danger',
                message: 'لديك حساب بالفعل، يرجى تسجيل الدخول مباشرة.',
              });
            } else {
              var accountId = (await new AccountModel().create({user_id: user.id})).insertId;
              var token = JWTAuth.sign({userId: accountId}, accountId, 'account', 'verify');
              // send email with token
              // TODO: create script to send sms

              alertMessages.push({
                success: true,
                type: 'success',
                message: 'تم إرسال رابط التحقق إلى البريد الإلكتروني الخاص بك.',
              });
            }
          } else {
            validates.email = 'رقم الهاتف غير صحيح.';
          }
        }
      } else {
        alertMessages.push({
          success: false,
          type: 'danger',
          message: 'يرجى إختيار طريقة التحقق.',
        })
      }
    }
    return response.render('public/pages/index', {
      alertMessages: alertMessages,
      validates: validates,
      values: values,
    });
  }

  static async setPassword(request, response) {
    var token = await JWTAuth.verify(request.token, 'verify');
    if (!token) {
      return response.status(400, 'Invalid token');
    }
    // else if ((Date.now() - Date.parse(token.row.last_used_at)) > (5 * 60 * 1000)) {
    //   console.log(Date.now(), Date.parse(token.row.last_used_at), Date.now() - Date.parse(token.row.last_used_at), 5 * 60 * 1000);
    //   return response.status(400, 'Token expired');
    // }
    var validates = {};
    var values = {
      password: '',
      confirm: '',
    }
    var alertMessages = [];
    if (request.type == 'POST') {
      if (request.password == undefined || request.password == '') {
        validates.password = 'كلمة السر مطلوبة';
      } else {
        values.password = request.password;
      }
      if (request.confirm == undefined || request.confirm == '') {
        validates.confirm = 'كلمة سر التأكيد مطلوبة';
      } else {
        values.confirm = request.confirm;
      }
      if (values.password && values.confirm && (values.password != values.confirm)) {
        validates.confirm = 'كلمة السر وكلمة التأكيد غير متطابقتين';
      }
      if (!validates.password && !validates.confirm) {
        await new AccountModel().update(token.user.id, {password: bcrypt.hashSync(values.password, bcrypt.genSaltSync(10))});
        await JWTAuth.signout(request.token, false);
        alertMessages.push({
          success: true,
          type: 'success',
          message: 'تم تغيير كلمة السر بنجاح، يمكنك الآن تسجيل الدخول لحسابك.',
        });
      }
    }
    return response.render('public/pages/set-password', {
      alertMessages: alertMessages,
      validates: validates,
      values: values,
    });
  }

}

module.exports = UserController;