const ColumnMakerException = require('./hundler/column_maker_exception');

class ColumnMaker {

  columnName;
  type;
  dataLenght;
  defaultValue;
  notNull = true;
  isAutoIncrement = false;

  constructor(columnName) {
    this.columnName = columnName;
  }

  string(type = 'varchar') {
    this.type = type == 'long' ? 'LONGTEXT' : type == 'text' ? 'TEXT': type == 'char' ? 'CHAR': 'VARCHAR';
    return this;
  }

  integer(big = false) {
    this.type = big ? 'BIGINT' : 'INT';
    return this;
  }

  float() {
    this.type = 'FLOAT';
    return this;
  }

  boolean() {
    this.type = 'BOOLEAN';
    return this;
  }

  datetime() {
    this.type = 'TIMESTAMP';
    return this;
  }

  array() {
    this.string('long');
    return this;
  }

  _length(len) {
    this.dataLenght = len;
    return this;
  }

  default(value) {
    if (!this.type)
      throw new ColumnMakerException('The type of column required');
    this.defaultValue = this.type == 'INT' | this.type == 'BIGINT' || this.type == 'BOOLEAN' || this.type == 'FLOAT'
      ? value
      : `'${value}'`;
    return this;
  }

  defaultCurrentTime() {
    this.defaultValue = 'CURRENT_TIMESTAMP';
    return this;
  }

  nullable() {
    this.notNull = false;
    return this;
  }

  autoIncrement() {
    this.isAutoIncrement = true;
    return this;
  }

  choices(items) {
    var _items = [];
    items.forEach(item => {
      _items.push(`'${item}'`);
    });
    this.type = `ENUM( ${_items.join(', ')})`;
    return this;
  }

  getQuery() {
    var query = '`' + this.columnName + '`';
    if (!this.type) 
      throw new ColumnMakerException('The column type required');
    query += ` ${this.type}`;
    if (this.dataLenght) query += ` (${this.dataLenght.toString()})`;
    if (this.notNull) query += ' NOT NULL';
    else query += ' NULL';
    if (this.defaultValue) query += ` DEFAULT ${this.defaultValue}`;
    if (this.isAutoIncrement) query += ' AUTO_INCREMENT'
    return query;
  }

}

module.exports = ColumnMaker