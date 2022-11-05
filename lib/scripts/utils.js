const fs = require('fs');
const { exit } = require('process');
const process = require('process');

const applicationsPath = `${__dirname}/../../services/applications/`;
exports.applicationsPath = applicationsPath;

exports.fLCapital = (s) => { return s = `${s.charAt(0).toUpperCase()}${s.slice(1)}`; };

exports.error = (msg, _exit = true) => {
  console.error(msg);
  if (_exit) exit();
};

exports.getApplicationsNames = () => {
  var appNames = [];
  fs.readdirSync(applicationsPath).forEach(appId => {
    if (fs.lstatSync(`${applicationsPath}${appId}`).isDirectory()) {
      appNames.push(appId);
    }
  });
  return appNames;
};

exports.getProssesArg = (argName, pos, required = true) => {
  var arg = process.argv[pos];
  if (required && !arg) {
    exports.error(`${argName} required'`);
  }
  return arg;
};

exports.getTimeStamp = () => {
  return new Date().toISOString().replaceAll('T', ' ').replaceAll('Z', ' ').replaceAll(':', '-');
};

exports.getTemplate = (tmplateName, ext = 'js') => {
  return fs.readFileSync(`${__dirname}/templates/${tmplateName}.${ext}.tp`, 'utf8');
};