const fs = require('fs');
const path = require('path');
const { getProssesArg, getApplicationsNames, error, fLCapital, getTemplate } = require('./utils');

var view_content = getTemplate('view', 'ejs');

var view_name = getProssesArg('view name', 2);
var appId = getProssesArg('appid', 3);

if (getApplicationsNames().indexOf(appId) == -1) error('undefined appId', appId);

var dir = '';
var view_dir = '';
if (view_name.indexOf('/') != -1) {
  dir = view_name;
  view_name = view_name.split('/')[view_name.split('/').length-1];
  dir = (path.join(...dir.split('/').splice(0, dir.split('/').length - 1))+'/').replaceAll('\\', '/');
  for (let i = 0; i < dir.split('/').length-1; i++) {
    view_dir += '/..';
  }
}

var _dir = (`${__dirname}/../../services/applications/${appId}/views/${appId}`).replaceAll('\\', '/');
if (dir != '') {
  dir.split('/').forEach(dirItem => {
    if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
    _dir += `/${dirItem}`;
  });
}

view_content = view_content
  .replaceAll('{{ view_name }}', fLCapital(view_name))
  .replaceAll('{{ dir }}', view_dir);

fs.appendFileSync(
  `${__dirname}/../../services/applications/${appId}/views/${appId}/${dir}${view_name}_view.ejs`,
  view_content
);

console.log('view Created');
