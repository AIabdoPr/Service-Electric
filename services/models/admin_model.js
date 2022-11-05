const Model = require('../../lib/pkgs/model');

class AdminModel extends Model {

  tb_name = 'admins';
  columns = {
    id: 'integer',
    user_id: 'integer',
    password: 'string',
    permissions: 'array',
    remember_token_id: 'integer',
    created_at: 'datetime',
    updated_at: 'datetime',
  };

  hiddens = [
    'remember_token_id',
    'email_verified_at',
    'password',
    'updated_at',
  ]

  links = {
    user_id: 'user',
    remember_token_id: 'remember_token',
  }

}

module.exports = AdminModel