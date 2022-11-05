const JWTAuth = require('../../../../lib/pkgs/jwt_auth');
const Middleware = require('../../../../lib/pkgs/middleware');

class JwtMiddleware extends Middleware {

  cookieAuthKey = 'adminAuth';

  constructor() {
    super('admin', 'jwt');
  }

  cookiesParser(cookieContent) {
    var cookie = {};
    if (cookieContent) {
      cookieContent.split('; ').forEach(item => {
        cookie[item.split('=')[0]] = item.split('=')[1];
      });
    }
    return cookie;
  }

  verify = async (request, response) => {
    var token = request.cookies[this.cookieAuthKey];
    if (token) {
      try {
        var verifyData = await JWTAuth.verify(token);
        if (verifyData) {
          for (const key in verifyData.tokenData) {
            request.addValue(key, verifyData.tokenData[key]) ;
          }
          request.user = verifyData.user;
          return { success: true };
        } else {
          return { success: false, redirectUrl: `${request.getRequestHostUrl()}/admin/login` };
        }
      } catch (error) {
        console.log('auth:', error);
        return { success: false, redirectUrl: `${request.getRequestHostUrl()}/admin/login` };
      }
    } else {
      return { success: false, redirectUrl: `${request.getRequestHostUrl()}/admin/login` };
    }
  };

  socketVerify = async (socket, next) => {
    var cookie = this.cookiesParser(socket.handshake.headers.cookie);
    if (cookie[this.cookieAuthKey]) {
      try {
        var verifyData = await JWTAuth.verify(cookie[this.cookieAuthKey]);
        if (verifyData && verifyData.tokenData && verifyData.tokenData.userId) {
          socket.handshake.query.userId = verifyData.tokenData.userId;
          return next();
        } else {
          return next(new Error('Invalid token'));
        }
      } catch (error) {
        console.log('auth:', error);
        // return next(new Error(error.message));
        return error.message.toString();
      }
    } else {
      return next(new Error('Token required'));
    }
  };

}

module.exports = JwtMiddleware;