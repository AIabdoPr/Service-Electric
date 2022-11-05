const bcrypt = require('bcrypt');
const { getProssesArg } = require('./utils');

var password = getProssesArg('password', 2);
var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

console.log(`your fake password: ${password} -> ${hashPassword}`);