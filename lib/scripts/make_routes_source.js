const fs = require('fs');
const { getProssesArg, getTemplate, fLCapital, getApplicationsNames, error } = require('./utils');

var type = getProssesArg('type name (api/socket)', 2);
if (['api', 'socket'].indexOf(type) == -1) error(`invalide type (${type}), please enter (api/socket)`);
var appId = getProssesArg('appid', 3);

var routes_source_content = getTemplate(`routes_source_${type}`);

if (getApplicationsNames().indexOf(appId) == -1) error('undefined appId', appId);

routes_source_content = routes_source_content.replaceAll('{{ app_id }}', appId)
        .replaceAll('{{ appid }}', appId.toLowerCase());
        
fs.appendFileSync(
  `${__dirname}/../../services/applications/${appId}/routes/${type}_routes.js`,
  routes_source_content
);

console.log('Routes Source Created');