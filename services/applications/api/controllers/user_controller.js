const UserModel = require("../../../models/user_model");
const bcrypt = require('bcrypt');
const JWTAuth = require("../../../../lib/pkgs/jwt_auth");
const AccountModel = require("../../../models/account_model");

class UserController {

  static async login(request, response) {
    var userModel = new UserModel();
    var accountModel = new AccountModel();
    var success = false;
    var message = "";
    var token = null;

    if (request.email) {
      if (request.password) {
        var user = await userModel.find(request.email, 'email');
        if (user) {
          var account = await accountModel.find(user.id, 'user_id');
          if (account) {
            if (await bcrypt.compare(request.password, account.password)) {
              success = true;
              message = "Login successfully";
              token = await JWTAuth.sign(
                { userId: account.id },
                account.id,
                'account',
                'jwt.verify',
                request.remember == true,
              );
            } else {
              message = "Invalid password";
            }
          } else {
            message = "You have not registered yet";
          }
        }
      } else {
        message = "Password is required";
      }
    } else {
      message = "Email is required";
    }

    response.json({
      success: success,
      message: message,
      token: token,
    });
  }

  static async signup(request, response) {
    var userModel = new UserModel();
    var accountModel = new AccountModel();
    var success = false;
    var message = "";
    var token = null;

    console.log(request);

    if(request.firstname && request.lastname && request.email && request.password && request.phone) {
      var user = await userModel.find(request.email, 'email'); // هنا نشوف اسكو الايمايل مستعمل
      if(user) {
        message = 'This email already used please login.';
      } else {
        var user = await userModel.create({
          firstname: request.firstname,
          lastname: request.lastname,
          phone: request.phone,
          email: request.email,
        });
        var account = await accountModel.create({
          user_id: user.insertId,
          password: bcrypt.hashSync(request.password, bcrypt.genSaltSync(10)),
          verification_images_ids: [],
          settings: {},
        });
        var verificationCode = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 6; i++ ) {
          verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        // sendMail(request.email, 'email-verification', verificationCode); // هادي ممبعد نكرييها
        console.log(verificationCode);

        token = await JWTAuth.sign(
          { userId: account.insertId, verification_code: verificationCode },
          account.insertId,
          'account',
          'jwt.emailVerification',
          false,
          3,
        );
        
        message = `Successfully signup (code: "${verificationCode}")`;
        success = true;
      }
    } else {
      message = 'Please fill all data';
    }

    response.json({
      success: success,
      message: message,
      token: token,
    });
  }

  static async emailVerification(request, response) {
    var accountModel = new AccountModel();
    var success = false;
    var message = "";

    if(request.email_verification_code) {
      var account = await accountModel.find(request.userId);
      if(account && account.email_verifited_at) {
        message = 'This email verafated already';
      } else if(account) {
        if(request.verification_code == request.email_verification_code) {
          accountModel.update(account.id, {
            email_verifited_at: new Date().toISOString(),
          });
          message = 'Successfully verification email';
        success = true;
        } else {
          message = 'Invalid verification code';
        }
      } else {
        message = "somthing worng";
      }
    } else {
      message = 'Please fill all data';
    }

    response.json({
      success: success,
      message: message,
    });
  }

  static async passwordForgot(request, response) {
    var userModel = new UserModel();
    var accountModel = new AccountModel();
    var success = false;
    var message = "";
    var token = null;

    if(request.email) {
      var user = await userModel.find(request.email, 'email');
      if(user) {
        var account = await accountModel.find(user.id, 'user_id');
        if(account) {
          var verificationCode = '';
          var characters       = '0123456789';
          var charactersLength = characters.length;
          for ( var i = 0; i < 6; i++ ) {
            verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          console.log(verificationCode);

          token = await JWTAuth.sign(
            { userId: account.id, verification_code: verificationCode },
            account.id,
            'account',
            'jwt.PFEmailVerification',
            false,
            3,
          );

          message = `Successfully (code: "${verificationCode}")`;
          success = true;
        } else {
          message = 'some things worng';
        }
      } else {
        message = 'Invalid email';
      }
    } else {
      message = 'Please fill all data';
    }

    response.json({
      success: success,
      message: message,
      token: token,
    });
  }

  static async PFEmailVerification(request, response) {
    var accountModel = new AccountModel();
    var success = false;
    var message = "";
    var token = null;

    if(request.email_verification_code) {
      var account = await accountModel.find(request.userId);
      if(account) {
        if(request.verification_code == request.email_verification_code) {
          await accountModel.update(account.id, {
            email_verifited_at: new Date().toISOString(),
          });
          token = await JWTAuth.sign(
            { userId: account.id },
            account.id,
            'account',
            'jwt.passwordReset',
            false,
            3,
          );
          message = 'Successfully verification email';
          success = true;
        } else {
          message = 'Invalid verification code';
        }
      } else {
        message = "somthing worng";
      }
    } else {
      message = 'Please fill all data';
    }

    response.json({
      success: success,
      message: message,
      token: token,
    });
  }

  static async passwordReset(request, response) {
    var accountModel = new AccountModel();
    var success = false;
    var message = "";

    if(request.new_password) {
      var account = await accountModel.find(request.userId);
      console.log(request.userId, account, request);
      if(account) {
        await accountModel.update(account.id, {
          password: bcrypt.hashSync(request.new_password, bcrypt.genSaltSync(10)),
        });
        message = 'Successfully reset password';
        success = true;
      } else {
        message = 'Some things worng';
      }
    } else {
      message = 'Please fill all data';
    }
    
    response.json({
      success: success,
      message: message,
    });
  }

  static async getUser(request, response) {
    request.user.email_is_verifited = request.user.email_verifited_at != null;
    request.user.identity_is_verifited = request.user.identity_verifited_at != null;
    response.json({
      success: true,
      message: "Get user successfully",
      user: request.user,
    });
  }

  static async logout(request, response) {
    var signout = await JWTAuth.signout(request.token, false);
    console.log(signout);
    response.json({
      success: signout.success,
      message: signout.message,
    });
  }

}

module.exports = UserController;