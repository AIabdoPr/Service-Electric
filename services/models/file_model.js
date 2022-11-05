const Model = require("../../lib/pkgs/model");

class FileModel extends Model {
  
  tb_name = "files";

  indexName = 'name';

  columns = {
    name: 'string',
    path: 'string',
  };

  hiddens = [
    'path',
  ]

}

module.exports = FileModel