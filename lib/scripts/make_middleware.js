const fs = require('fs');
const path = require('path');
const { getProssesArg, getTemplate, fLCapital, getApplicationsNames, error } = require('./utils');


var middleware_content = getTemplate('middleware');

var middleware_name = getProssesArg('middleware name', 2);
var appId = getProssesArg('appid', 3);

if (getApplicationsNames().indexOf(appId) == -1) error('undefined appId', appId);

var dir = '';
var middleware_dir = '';
if (middleware_name.indexOf('/') != -1) {
  dir = middleware_name;
  middleware_name = middleware_name.split('/')[middleware_name.split('/').length-1];
  dir = (path.join(...dir.split('/').splice(0, dir.split('/').length - 1)) + '/').replaceAll('\\', '/');
  for (let i = 0; i < dir.split('/').length-1; i++) {
    middleware_dir += '/..';
  }
}
var _dir = (`${__dirname}/../../services/applications/${appId}/middlewares/`).replaceAll('\\', '/');
if (dir != '') {
  dir.split('/').forEach(dirItem => {
    if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
    _dir += `/${dirItem}`;
  });
}

middleware_content = middleware_content.replaceAll('{{ app_id }}', appId)
        .replaceAll('{{ auth_key }}', middleware_name.toLowerCase())
        .replaceAll('{{ class_name }}', fLCapital(middleware_name))
        .replaceAll('{{ middleware_name }}', middleware_name)
        .replaceAll('{{ dir }}', fLCapital(middleware_dir));
        
fs.appendFileSync(
  `${__dirname}/../../services/applications/${appId}/middlewares/${dir}${middleware_name}_middleware.js`,
  middleware_content
);

console.log('Middleware Created');