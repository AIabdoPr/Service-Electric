const bcrypt = require('bcrypt');
const fs = require('fs');
const { error } = require('./utils');

var constsLiens = fs.readFileSync(`${__dirname}/../../src/consts.js`).toString().split('\n');
function searchForValue(valueName) {
  var value = null;
  var line = null;
  var i = null;
  for (i = 0; i < constsLiens.length; i++) {
    line = constsLiens[i].slice(0, constsLiens[i].length-1);
    if (line.indexOf(`static ${valueName} =`) != -1 && !(line.replaceAll(' ', '').startsWith('//'))) {
      value = line.split('=')[1].split('//')[0]
                  .replaceAll('"', '')
                  .replaceAll("'", '')
                  .replaceAll(';', '')
                  .replaceAll(' ', '');
      break;
    }
  }
  return {
    line: line,
    index: i,
    value: value,
  };
}

var appName = searchForValue('APP_NAME');
var appKey = searchForValue('APP_KEY');

if (appKey.value == null) error('app key required');

var jwtSecret = bcrypt.hashSync(`${appKey.value}-${appName.value}(${Date.now()})`, bcrypt.genSaltSync(10));

var oldJwtSecret = searchForValue('JWT_SECRET');

constsLiens[oldJwtSecret.index] = `  // ${oldJwtSecret.line}\n  static JWT_SECRET = '${jwtSecret}'; // added at ${Date().toString()}`;

console.log(jwtSecret, oldJwtSecret.value);
fs.writeFileSync(`${__dirname}/../../src/consts.js`, constsLiens.join('\n'))