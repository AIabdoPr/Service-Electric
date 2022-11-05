const fs = require('fs');
const path = require('path');
const { getProssesArg, getApplicationsNames, error, fLCapital, getTemplate } = require('./utils');

var controller_content = getTemplate('controller');

var controller_name = getProssesArg('controller name', 2);
var appId = getProssesArg('appid', 3);

if (getApplicationsNames().indexOf(appId) == -1) error('undefined appId', appId);

var dir = '';
var controller_dir = '';
if (controller_name.indexOf('/') != -1) {
  dir = controller_name;
  controller_name = controller_name.split('/')[controller_name.split('/').length-1];
  dir = (path.join(...dir.split('/').splice(0, dir.split('/').length - 1)) + '/').replaceAll('\\', '/');
  for (let i = 0; i < dir.split('/').length-1; i++) {
    controller_dir += '/..';
  }
}

var _dir = (`${__dirname}/../../services/applications/${appId}/controllers/`).replaceAll('\\', '/');
if (dir != '') {
  dir.split('/').forEach(dirItem => {
    if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
    _dir += `/${dirItem}`;
  });
}

controller_content = controller_content
  .replaceAll('{{ controller_name }}',fLCapital(controller_name))
  .replaceAll('{{ dir }}', controller_dir);

fs.appendFileSync(
  `${__dirname}/../../services/applications/${appId}/controllers/${dir}${controller_name}_controller.js`,
  controller_content
);

console.log('Controller Created');
