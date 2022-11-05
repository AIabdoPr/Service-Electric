const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("products");
    this.setupTable();
  }

  setupTable() {
    this.table.index("id");
    this.table.column("name").string()._length(11);
    this.table.column("user_id").string()._length(11);
    this.table.column("price").float().default(0);
    this.table.column("category").string()._length(11);
    this.table.column("tags").array();//.default('[]');
    this.table.column("images_ids").array();
    this.table.column("description").string()._length(255);
    this.table.column("count").integer(); // الكمية 
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
