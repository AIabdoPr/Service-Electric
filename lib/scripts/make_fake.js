const fs = require('fs');
const { fLCapital, getProssesArg, getTimeStamp, getTemplate } = require('./utils');


var fake_content = getTemplate('fake');

var model_name = getProssesArg('model_name', 2);
var fake_timestamp = getTimeStamp();

fake_content = fake_content.replaceAll('{{ model_name }}', model_name)
                            .replaceAll('{{ class_name }}', fLCapital(model_name));

fs.appendFileSync(`${__dirname}/../../services/database/fakes/${fake_timestamp}fake_${model_name.toLowerCase()}.js`, fake_content);
console.log('Fake Created');