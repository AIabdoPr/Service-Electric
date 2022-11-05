const fs = require('fs');
const Application = require('../../lib/pkgs/application');
const RouteApi = require('../../lib/pkgs/route_api');
const Environment = require('../../src/environment');

class Applications {

  apps = [];

  store() {
    fs.readdirSync(__dirname).forEach(appId => {
      if (fs.lstatSync(`${__dirname}/${appId}`).isDirectory()) {
        var application =  new Application(appId);
        application.store();
      }
    });
    // new RouteApi().get('/resources/:appId/:filename').func(this.resourcesController).store();
    new RouteApi().get('*').func((request, response) => {
      return response.status(404);
    }).store();

  }

  // resourcesController(request, response) {
  //   if (Environment.storages[request.appId]) {
  //     var filename = `${Environment.storages[request.appId]}/${request.filename.replaceAll('->', '/')}`;
  //     if (fs.existsSync(filename)) {
  //       return response.download(filename);
  //     } else {
  //       return response.status(404, `file ' ${request.filename} ' not exists`);
  //     }
  //   } else {
  //     return response.status(404, `Invalid app id '${request.appId}'`);
  //   }
  // }

}

module.exports = Applications;