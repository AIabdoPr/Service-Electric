const JWTAuth = require('../../../../lib/pkgs/jwt_auth');
const Middleware = require('../../../../lib/pkgs/middleware');

class JwtMiddleware extends Middleware {

  constructor() {
    super('api', 'jwt');
  }

  emailVerification = async (request, respone) => {
    if (request.token) {
      try {
        var verifyData = await JWTAuth.verify(request.token, true, 'jwt.emailVerification');
        if (verifyData.success && verifyData.tokenData) {
          for (const key in verifyData.tokenData) {
            request.addValue(key, verifyData.tokenData[key]);
          }
          request.user = verifyData.user;
          request.tokenDate = verifyData.row.created_at;
          return { success: true };
        } else {
          return verifyData;
        }
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    } else {
      return { success: false, message: 'The token is required' };
    }
  };

  PREmailVerification = async (request, respone) => {
    try {
      var verifyData = await JWTAuth.verify(request.token, true, 'jwt.PFEmailVerification');
      if (verifyData.success && verifyData.tokenData) {
        for (const key in verifyData.tokenData) {
          request.addValue(key, verifyData.tokenData[key]);
        }
        request.user = verifyData.user;
        request.tokenDate = verifyData.row.created_at;
        return { success: true };
      } else {
        return verifyData;
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  passwordReset = async (request, respone) => {
    if (request.token) {
      try {
        var verifyData = await JWTAuth.verify(request.token, true, 'jwt.passwordReset');
        if (verifyData.success && verifyData.tokenData) {
          for (const key in verifyData.tokenData) {
            request.addValue(key, verifyData.tokenData[key]);
          }
          request.user = verifyData.user;
          request.tokenDate = verifyData.row.created_at;
          return { success: true };
        } else {
          return verifyData;
        }
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    } else {
      return { success: false, message: 'The token is required' };
    }
  };

  verify = async (request, response) => {
    if (request.token) {
      try {
        var verifyData = await JWTAuth.verify(request.token, true, 'jwt.verify');
        if (verifyData.success && verifyData.tokenData) {
          for (const key in verifyData.tokenData) {
            request.addValue(key, verifyData.tokenData[key]);
          }
          request.user = verifyData.account;
          request.tokenDate = verifyData.row.created_at;
          return { success: true };
        } else {
          return verifyData
        }
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    } else {
      return { success: false, message: 'The token is required' };
    }
  };

  socketVerify = async (socket, next) => {
    var query = socket.handshake.query;
    
    if (query.token) {
      try {
        var verifyData = await JWTAuth.verify(query.token, true, 'jwt.verify');
        if (verifyData.success && verifyData.tokenData && verifyData.tokenData.userId) {
          socket.handshake.query.userId = verifyData.tokenData.userId;
          return next();
        } else {
          return next(new Error(verifyData.message));
        }
      } catch (error) {
        console.log(error.message);
        return error.message.toString();
      }
    } else {
      return next(new Error('Invalid token'));
    }
  };

}

module.exports = JwtMiddleware;