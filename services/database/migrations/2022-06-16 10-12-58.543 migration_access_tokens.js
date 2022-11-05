const TableMaker = require('../../../lib/pkgs/table_maker');

class Migration {
  
  table;
  // logInfo = 'some log infos';

  constructor() {
    this.table = new TableMaker('access_tokens');
    this.setupTable();
  }

  setupTable() {
    this.table.index('token', 'string');
    this.table.column('item_id').integer()._length(255).nullable();
    this.table.column('model_name').string()._length(255).nullable();
    this.table.column('middleware').string()._length(255);
    this.table.column('last_used_at').datetime().nullable();  
    this.table.column('expire_at').datetime().nullable();
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
