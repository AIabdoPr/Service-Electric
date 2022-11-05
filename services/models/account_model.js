const Model = require("../../lib/pkgs/model");

class AccountModel extends Model {
  
  tb_name = "accounts";
  columns = {
    id: 'intger',
    user_id: 'intger',
    password: 'string',
    verification_images_ids: 'array',
    email_verifited_at: 'datetime',
    identity_verifited_at: 'datetime',
    settings: 'array',
    created_at: 'datetime',
    updated_at: 'datetime',
  };

  links = {
    user_id: 'user',
    verification_images_ids: 'file',
  }

  hiddens = [
    'password',
    'email_verifited_at',
    'identity_verifited_at',
    'verification_images_ids',
    'updated_at',
  ]

  // customRow = (row) => {
  //   row.email_is_verifited = row.email_verifited_at != null;
  //   row.identity_is_verifited = row.identity_verifited_at != null;
  //   // for (const key in row.user) {
  //   //   row[key] = row.user[key]
  //   // }
  //   // delete row.user;
  //   return row;
  // };
}

module.exports = AccountModel