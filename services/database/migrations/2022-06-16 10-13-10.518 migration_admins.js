const TableMaker = require('../../../lib/pkgs/table_maker');

class Migration {
  
  table;
  // logInfo = 'some log infos';

  constructor() {
    this.table = new TableMaker('admins');
    this.setupTable();
  }

  setupTable() {
    this.table.index('id');
    this.table.column('user_id').integer();
    this.table.column('password').string()._length(255);
    this.table.column('remember_token_id').integer().nullable();
    this.table.column("permissions").array();//.default('{}');
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
