const fs = require('fs');
const MySQL = require('promise-mysql');
const Database = require('../pkgs/database');
const TableMaker = require('../pkgs/table_maker');
const { exit } = require('process');
const Environment = require('../../src/environment');
const Consts = require('../../src/consts');

async function getDBMigrations() {
  var dbMigrations = await Environment.database.select('migrations', '*', '');
  var migrations = [];
  var batch = 0;
  dbMigrations.forEach(migration => {
    migrations.push(migration.migration)
    if (migration.batch > batch) batch = migration.batch;
  });
  return [migrations, batch];
}

async function executeMigrations(migrations) {
  var [dbMigrations, batch] = await getDBMigrations();
  var _migrations = [];
  migrations.forEach(migration => {
    if (dbMigrations.indexOf(migration) == -1 && migration.endsWith('.js')) {
      _migrations.push(migration);
    }
  });
  if (_migrations.length > 0) {
    for (let migrationItemId = 0; migrationItemId < _migrations.length; migrationItemId++) {
      console.log(`Migrating: ${_migrations[migrationItemId]}`);
      const MigrateItem = new (require(`../../services/database/migrations/${_migrations[migrationItemId]}`))();
      await MigrateItem.execute();
      if (MigrateItem.logInfo) console.log(MigrateItem.logInfo);
      await Environment.database.insert('migrations', ['migration', 'batch'], [[_migrations[migrationItemId], batch + 1]]);
      console.log(`Migrated: ${_migrations[migrationItemId]}`);
    }
    exit();
  } else {
    console.log("nothing to migrate");
    exit();
  }
}

async function main() {
  var migrations = fs.readdirSync(`${__dirname}/../../services/database/migrations`);

  Environment.databaseConnection = await MySQL.createConnection(Consts.DB_DNS);
  Environment.database = new Database();

  var isExists = await Environment.database.tbExists('migrations');
  if (!isExists) {
    var table = new TableMaker('migrations');
    table.index('id').integer()._length(10).autoIncrement();
    table.column('migration').string()._length(255);
    table.column('batch').integer()._length(11);
    await table.execute();
    await executeMigrations(migrations);
  } else {
    await executeMigrations(migrations);
  }
}

main();