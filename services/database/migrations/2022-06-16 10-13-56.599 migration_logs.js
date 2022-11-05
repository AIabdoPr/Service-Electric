const TableMaker = require('../../../lib/pkgs/table_maker');

class Migration {
  
  table;
  // logInfo = 'some log infos';

  constructor() {
    this.table = new TableMaker('logs');
    this.setupTable();
  }

  setupTable() {
    this.table.index('id');
    this.table.column('type').choices(['LOG', 'ERROR', 'INFO', 'WARNING']).default('LOG');
    this.table.column('name').string()._length(255);
    this.table.column('message').string()._length(255);
    this.table.column('extra_values').array().nullable();
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
