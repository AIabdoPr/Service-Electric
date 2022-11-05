const ColumnMaker = require('./column_maker');
const ColumnMakerException = require('./hundler/column_maker_exception');
const Environment = require('../../src/environment');

class TableMaker {

  tb_name;
  columns = {};
  indexs = [];

  constructor(tb_name) {
    this.tb_name = tb_name;
  }

  column(column_name) {
    if (this.columns.hasOwnProperty(column_name))
      throw new ColumnMakerException('This column name already exists');
    var column = new ColumnMaker(column_name)
    this.columns[column_name] = column;
    return column;
  }

  addIndex(indexType, values) {
    var items = [];
    values.forEach(value => {
      items.push('`' + value + '`');
    });
    this.indexs.push(`${indexType} (${items.join(', ')})`);
  }

  index(columnName, type = 'integer') {
    if (type == 'integer') {
      var column = this.column(columnName).integer()._length(11).autoIncrement();
    } else if (type == 'string') {
      var column = this.column(columnName).string()._length(255);
    } else {
      var column = this.column(columnName);
    }
    this.addIndex('PRIMARY KEY', [columnName]);
    return column;
  }

  timestamps() {
    this.column('created_at').datetime().defaultCurrentTime();
    this.column('updated_at').datetime().nullable();
  }

  getQuery() {
    var _columns = [];
    for (let columnName in this.columns) {
      _columns.push(this.columns[columnName].getQuery());
    }
    return 'CREATE TABLE `' + this.tb_name + '` ('
           + `${_columns.join(', ')} ${this.indexs.length > 0  ? `, ${this.indexs.join(', ')}` : ''})`;
  }

  async execute() {
    return await Environment.databaseConnection.query(this.getQuery());
  }
}

module.exports = TableMaker