const fs = require('fs');
const { getTimeStamp, getProssesArg, getTemplate } = require('./utils');

var migrate_content = getTemplate('migration');
  
var tb_name = getProssesArg('tb_name', 2).toLowerCase()+'s';
var migration_timestamp = getTimeStamp();

migrate_content = migrate_content.replaceAll('{{ tb_name }}', tb_name)
                                  .replaceAll('{{ migration_timestamp }}', migration_timestamp);

fs.appendFileSync(`${__dirname}/../../services/database/migrations/${migration_timestamp}migration_${tb_name.toLowerCase()}.js`, migrate_content);
console.log('Migrate Created');