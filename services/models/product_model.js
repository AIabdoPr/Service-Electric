const Model = require("../../lib/pkgs/model");

class ProductModel extends Model {
  
  tb_name = "products";
  columns = {
    name: 'string',
    user_id: 'string',
    price: 'float',
    category: 'string',
    tags: 'array',
    images_ids: 'array',
    description: 'string',
    caount: 'integer',
    created_at: 'datetime',
    updated_at: 'datetime',
  };

  links = {
    user_id: 'user',
    images_ids: 'file',
  };

}

module.exports = ProductModel