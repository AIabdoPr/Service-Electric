const fs = require('fs');
const { execSync } = require('child_process');
const { getProssesArg, error, getApplicationsNames, applicationsPath } = require('./utils');

var appId = getProssesArg('appid', 2);
var types = getProssesArg('type', 3).split('_');

if (getApplicationsNames().indexOf(appId) != -1) error('appid already exists');

console.log(`creating the application with id ${appId}`);
fs.mkdirSync(`${applicationsPath}${appId}`);
if (types.indexOf('c') != -1) {
  fs.mkdirSync(`${applicationsPath}${appId}/controllers`);
  console.log(execSync(`npm run make:controller user ${appId}`).toString());
}
if (types.indexOf('m') != -1) {
  fs.mkdirSync(`${applicationsPath}${appId}/middlewares`);
  console.log(execSync(`npm run make:middleware jwt ${appId}`).toString());
}
if (types.indexOf('r') != -1 || types.indexOf('ra') != -1) {
  fs.mkdirSync(`${applicationsPath}${appId}/routes`);
  console.log(execSync(`npm run make:routes_source api ${appId}`).toString());
}
if (types.indexOf('r') != -1 || types.indexOf('rs') != -1) {
  if (!fs.existsSync(`${applicationsPath}${appId}/routes`)) fs.mkdirSync(`${applicationsPath}${appId}/routes`);
  console.log(execSync(`npm run make:routes_source socket ${appId}`).toString());
}
if (types.indexOf('v') != -1) {
  fs.mkdirSync(`${applicationsPath}${appId}/views`);
  console.log(execSync(`npm run make:view pages/index ${appId}`).toString());
}

console.log('Application Created')