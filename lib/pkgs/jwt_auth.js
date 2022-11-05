const JWT = require('jsonwebtoken');
const AccessTokenModel = require('../../services/models/access_token_model');
const Consts = require('../../src/consts');

class JWTAuth {

  static async sign(data, itemId = null, modelName = null, middleware, remember = false, expireMinutes = null, secretKey = Consts.JWT_SECRET) {
    var accessTokenModel = new AccessTokenModel();
    var token = JWT.sign(data, secretKey);
    await accessTokenModel.create({
      model_name: modelName,
      item_id: itemId,
      middleware: middleware,
      token: token,
      expire_at: expireMinutes != null ? new Date(new Date().getTime() + expireMinutes * 60000).toISOString() : null,
      last_used_at: new Date().toISOString(),
    });
    if (remember) {
      const UserModel = require(`${Consts.APP_PATH}services/models/${modelName}_model`);
      await new UserModel().update(userId, {
        remember_token_id: token,
      });
    }
    return token;
  }

  static async verify(token, setDate = true, middleware, secretKey = Consts.JWT_SECRET) {
    var accessTokenModel = new AccessTokenModel();

    var tokenData = JWT.verify(token, secretKey);
    if (tokenData) {
      var accessToken = await accessTokenModel.find(token);
      if(accessToken && accessToken.middleware == middleware
        // && accessToken.expire_at >=new Date()
        ) {
          if(setDate) {
            await accessTokenModel.update(token, {
              last_used_at: new Date().toISOString(),
            });
          }
          var data = {
            success: true,
            row: accessToken,
            tokenData: tokenData,
          }
          if(accessToken.model_name && accessToken.item_id) {
            const Model = require(`${Consts.APP_PATH}services/models/${accessToken.model_name}_model`);
            data[accessToken.model_name] = await new Model().find(accessToken.item_id, 'id', true, true);
          }
          return data;
      } else {
        return {
          success: false,
          message: 'Invalid token',
        };
      }
    } else {
      return {
        success: false,
        message: 'Invalid token'
      };
    }
  }

  static async signout(token, remember = true, secretKey = Consts.JWT_SECRET) {
    var tokenData = JWT.verify(token, secretKey);
    var accessToken = await new AccessTokenModel().find(token);
    if (accessToken) {
      await new AccessTokenModel().delete(token);
      if (remember) {
        const UserModel = require(`${Consts.APP_PATH}services/models/${accessToken.model_name}_model`);
        var userModel = new UserModel();
        await userModel.update(accessToken.user_id, {
          remember_token_id: null,
        });
      }
      return { success: true };
    } else {
      return { success: false, message: 'invalid token' };
    }
  }

}

module.exports = JWTAuth;