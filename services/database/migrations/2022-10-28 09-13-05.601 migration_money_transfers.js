const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("money_transfers");
    this.setupTable();
  }

  setupTable() {
    this.table.index("id");
    this.table.column("from_id").string()._length(11); //من 
    this.table.column("to_id").string()._length(11); // الى
    this.table.column("balance").float(); // شحال لبري
    this.table.column("fom_card_type").array(); // يعني من بايسيرا مثلا
    this.table.column("to_card_type").array(); // لوايز
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
