const express = require('express');
const http = require('http');

const Environment = require('./src/environment');
const Consts = require('./src/consts');

const bodyParser = require('body-parser');
const Cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const formidableMiddleware = require('./formidableMiddleware.js');

const MySQL = require('promise-mysql');
const Database = require('./lib/pkgs/database');
const DatabaseListener = require('./lib/pkgs/database_listener');
const Applications = require('./services/applications/applications');

async function main() {
  // create an app
  Environment.app = express();
  Environment.app.use(express.json());
  Environment.app.use(Cors());
  Environment.app.use(express.static(`${__dirname}/node_modules`));
  // Add headers before the routes are defined
  Environment.app.use((request, response, next) => {
    // Website you wish to allow to connect
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });
  Environment.app.use(bodyParser.json());
  Environment.app.use(bodyParser.urlencoded());
  Environment.app.use(bodyParser.urlencoded({ extended: true }));
  Environment.app.use(cookieParser());
  Environment.app.use(formidableMiddleware());
  Environment.app.set('view engine', 'ejs');
  Environment.app.disable('etag');
  Environment.app.use(session({
    secret: Consts.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  }));
  // init route checker
  Environment.addViewPath('services/general_storage/views');

  // create a server
  Environment.server = http.createServer(Environment.app);

  // init database connection
  Environment.databaseConnection = await MySQL.createConnection(Consts.DB_DNS);
  Environment.database = new Database();

  // init applications
  new Applications().store();

  // start listenig server
  Environment.server.listen(Consts.SERVER_PORT, (error) => {
    if (error) {
      console.error(error);
    } else {
      // init database listener
      Environment.databaseListener = new DatabaseListener();

      console.log('server started\n');
      console.log('server routes: ');
      var i = 1;
      Environment.app._router.stack.forEach(layer => {
        if (layer.route) {
          console.log(`${i}- '${layer.route.path}'`);
          i++;
        }
      });
      console.log('');
    }
  });
}

main();