class Consts {
  static APP_PATH = `${__dirname}/../`;
  static APPLICATIONS_PATH = `${Consts.APP_PATH}services/applications/`;
  static APP_NAME = 'Service Ectreq';
  static APP_KEY = 'service_ectreq_2022';
  static JWT_SECRET = '$2b$10$WSGi45Kh4aUAXE.Yzz/dp..8rMtDLc6VNdgmqq7WNPEGAvYIUlxfG'; // added at Fri Oct 28 2022 09:53:38 GMT+0100 (GMT+01:00)
  static SERVER_IP = 'localhost';
  static SERVER_PORT = 8000;
  static SERVER_URL = `'http://${this.SERVER_IP}:${this.SERVER_PORT}`;
  static DB_CONNECTION = 'mysql';
  static DB_HOSTNAME = 'localhost';
  static DB_PORTNUMB = 3306;
  static DB_DATABASE = 'service_ectreq';
  static DB_USERNAME = 'root';
  static DB_PASSWORD = 'Walid@1994';
  static DB_DNS = {
    host: Consts.DB_HOSTNAME,
    user: Consts.DB_USERNAME,
    password: Consts.DB_PASSWORD,
    database: Consts.DB_DATABASE,
    port: Consts.DB_PORTNUMB,
  }
  static DB_ENABLE_LISTENER = true;

  static SOCKET_HEADERS = {
    cors: {
      origin: '*',
      allowEIO3: true,
      // methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    allowEIO3: true,
    // transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
  }
}

module.exports = Consts;