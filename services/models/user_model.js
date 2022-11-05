const Model = require('../../lib/pkgs/model');

class UserModel extends Model {

  tb_name = 'users';
  columns = {
    id: 'integer',
    firstname: 'string',
    lastname: 'string',
    phone: 'string',
    email: 'string',
    address: 'string',
    balance: 'float',
    profile_image_id: 'string',
    background_image_id: 'string',
    created_at: 'datetime',
    updated_at: 'datetime',
  };

  hiddens = [
    'updated_at',
  ]

  links = {
    profile_image_id: 'file',
    background_image_id: 'file',
  }

}

module.exports = UserModel