const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("files");
    this.setupTable();
  }

  setupTable() {
    this.table.index("name", 'string');
    this.table.column('path').string()._length(255);
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
