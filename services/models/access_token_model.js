const Model = require("../../lib/pkgs/model");

class AccessTokenModel extends Model {

  tb_name = 'access_tokens';
  indexName = 'token';
  columns = {
    token: 'string',
    item_id: 'integer',
    model_name: 'string',
    last_used_at: 'datetime',
    expire_at: 'datetime',
    created_at: 'datetime',
    updated_at: 'datetime',
  };

}

module.exports = AccessTokenModel