const fs = require('fs');
const MySQL = require('promise-mysql');
const Database = require("../pkgs/database");
const TableMaker = require("../pkgs/table_maker");
const { exit } = require('process');
const Environment = require('../../src/environment');
const Consts = require('../../src/consts');

async function getDBFakes() {
  var dbFakes = await Environment.database.select('fakes', '*', '');
  var fakes = [];
  var batch = 0;
  dbFakes.forEach(fake => {
    fakes.push(fake.fake)
    if (fake.batch > batch) batch = fake.batch;
  });
  return [fakes, batch];
}

async function executeFakes(fakes) {
  var [dbFakes, batch] = await getDBFakes();
  var _fakes = [];
  fakes.forEach(fake => {
    if (dbFakes.indexOf(fake) == -1 && fake.endsWith('.js')) {
      _fakes.push(fake);
    }
  });
  if (_fakes.length > 0) {
    for (let fakeItemId = 0; fakeItemId < _fakes.length; fakeItemId++) {
      console.log(`faking: ${_fakes[fakeItemId]}`);
      const FakeItem = new (require(`../../services/database/fakes/${_fakes[fakeItemId]}`))();
      await FakeItem.execute();
      if (FakeItem.logInfo) console.log(FakeItem.logInfo);
      await Environment.database.insert('fakes', ['fake', 'batch'], [[_fakes[fakeItemId], batch + 1]]);
      console.log(`faked: ${_fakes[fakeItemId]}`);
    }
    exit();
  } else {
    console.log("nothing to fake");
    exit();
  }
}

async function main() {
  var fakes = fs.readdirSync(`${__dirname}/../../services/database/fakes`);

  Environment.databaseConnection = await MySQL.createConnection(Consts.DB_DNS);
  Environment.database = new Database();

  var isExists = await Environment.database.tbExists('fakes');
  if (!isExists) {
    var table = new TableMaker("fakes");
    table.index('id').integer()._length(10).autoIncrement();
    table.column('fake').string()._length(255);
    table.column('batch').integer()._length(11);
    await table.execute();
    await executeFakes(fakes);
  } else {
    await executeFakes(fakes);
  }
}

main();