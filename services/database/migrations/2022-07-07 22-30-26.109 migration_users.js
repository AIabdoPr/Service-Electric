const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("users");
    this.setupTable();
  }

  setupTable() {
    this.table.index("id");
    this.table.column('firstname').string()._length(255); // الاسم
    this.table.column('lastname').string()._length(255); // اللقب
    this.table.column('phone').string()._length(255); // رقم الهاتف
    this.table.column('email').string()._length(255); // البريد الإلكتروني
    // this.table.column('password').string()._length(255); // البريد الإلكتروني
    // this.table.column('remember_token_id').integer().nullable();
    this.table.column('address').string()._length(255); // البريد الإلكتروني
    this.table.column('balance').float().default(0);
    this.table.column('profile_image_id').string()._length(255).nullable();
    this.table.column('background_image_id').string()._length(255).nullable();
    // this.table.column('is_verificated').boolean().default(false);
    // this.table.column('verifited_at').datetime().nullable();
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
