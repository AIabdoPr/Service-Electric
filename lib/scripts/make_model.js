const path = require('path');
const fs = require('fs');
const { getProssesArg, fLCapital, getTemplate } = require('./utils');


var model_content = getTemplate('model');
  
var model_name = getProssesArg('model_name', 2);

var dir = '';
var model_dir = '';
if (model_name.indexOf('/') != -1) {
  dir = model_name;
  model_name = model_name.split('/')[model_name.split('/').length-1];
  dir = (path.join(...dir.split('/').splice(0, dir.split('/').length - 1))+'/').replaceAll('\\', '/');
  for (let i = 0; i < dir.split('/').length-1; i++) {
    model_dir += '/..';
  }
}

var tb_name = model_name.toLowerCase()+'s';
var columns = '{}';

model_content = model_content.replaceAll('{{ model_name }}', fLCapital(model_name))
                             .replaceAll('{{ tb_name }}', tb_name)
                             .replaceAll('{{ columns }}', columns)
                             .replaceAll('{{ dir }}', model_dir);
var _dir = (`${__dirname}/../../services/models`).replaceAll('\\', '/');  
dir.split('/').forEach(dirItem => {
  if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
  _dir += '/'+dirItem;
});

fs.appendFileSync(`services/models/${dir}${model_name.toLowerCase()}_model.js`, model_content);
console.log('Model Created');

