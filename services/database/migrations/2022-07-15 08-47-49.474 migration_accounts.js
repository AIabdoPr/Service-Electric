const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("accounts");
    this.setupTable();
  }

  setupTable() {
    this.table.index("id");
    this.table.column("user_id").integer()._length(11);
    this.table.column('password').string()._length(255);
    this.table.column('verification_images_ids').array();//.default('[]');
    this.table.column('email_verifited_at').datetime().nullable();
    this.table.column('identity_verifited_at').datetime().nullable();
    this.table.column('settings').array();//.default('{}');
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
