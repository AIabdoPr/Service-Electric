const Consts = require('../../src/consts');
const Database = require('./database');

class Model extends Database {

  tb_name = '';
  indexName = 'id';
  columns = {};
  links = {};
  events = {};
  hiddens = [];

  customRow = null;

  hide(row) {
    this.hiddens.forEach(column => {
      delete row[column];
    });
  }

  async render(result, link = true, hide = false) {
    for (let i = 0; i < result.length; i++) {
      try {
        for (let column in this.columns) {
          if (result[i][column]) {
            if (this.columns[column] == 'integer') {
              result[i][column] = parseInt(result[i][column]);
            } else if (this.columns[column] == 'float') {
              result[i][column] = parseFloat(result[i][column]);
            } else if (this.columns[column] == 'boolean') {
              result[i][column] = result[i][column] == 1 ? true: result[i][column] == 0 ? false : result[i][column];
            } else if (this.columns[column] == 'array') {
              result[i][column] = typeof result[i][column] == 'string' ? JSON.parse(result[i][column]) : result[i][column];
            }
            if(this.customRow) {
              result[i] = this.customRow(result[i]);
            }
          }
        }
      } catch (error) {
        console.log('parse error: ', error);
        console.log('resualt: ', result);
      }
      if (link) {
        for (const link in this.links) {
          const Model = require(`${Consts.APP_PATH}/services/models/${this.links[link]}_model`)
          var linkModel = new Model();
          if (this.columns[link] == 'array') {
            var data = [];
            for (let itemIndex = 0; itemIndex < result[i][link].length; itemIndex++) {
              data.push(await linkModel.find(result[i][link][itemIndex], false, hide));
            }
            result[i][link.replace('_ids', '')] = data;
          } else {
            result[i][link.replace('_id', '')] = await linkModel.find(result[i][link], false, hide);
          }
        }
      }
      if (hide) {
        this.hide(result[i]);
      }
    }
    return result;
  }

  async create(data = {}) {
    data = (await this.render([data], false, false))[0]
    var columns = [];
    var values = [];
    for (const [key, value] of Object.entries(data))  {
      columns.push(key);
      values.push(typeof(value) == 'string' ? value : JSON.stringify(value));
    }
    return await this.insert(this.tb_name, columns, [values]);
  }

  async all(link = true, hide = false, dateRange = '') {
    var result = await this.render(await this.select(this.tb_name, '*', '', dateRange), link, hide);
    if (this.events.hasOwnProperty('select')) return await this.events['select'](result);
    return result;
  }

  async where(where, link = true, hide = false, dateRange = '') {
    var result = await this.render(await this.select(this.tb_name, '*', where, dateRange), link, hide);
    if (this.events.hasOwnProperty('select')) return await this.events['select'](result);
    return result;
  }

  async whereIn(values, where = '', column = 'id', link = true, hide = false, dateRange = '') {
    var result = this.render(await this._whereIn(this.tb_name, '*', values, where, column, dateRange), link, hide);
    if (this.events.hasOwnProperty('select')) return await this.events['select'](result);
    else return result;
  }

  async find(id, indexName = null, link = true, hide = false, dateRange = '') {
    if (!indexName) indexName = this.indexName;
    return (await this.where([[indexName, '=', id]], link, hide, dateRange))[0];
  }

  async updateWhere(where, values) {
    values = (await this.render([values], false))[0];
    var _values = [];
    for (const [key, value] of Object.entries(values)) {
      _values.push([key, value]);
    }
    return await this._update(this.tb_name, _values, where);
  }

  async update(id, values) {
    return await this.updateWhere([[this.indexName, '=', id]], values);
  }

  async updateAll(values, callback) {
    return await this.updateWhere('', values, callback);
  }

  async delete(id, indexName = null) {
    if (!indexName) indexName = this.indexName;
    return await this._delete(this.tb_name, [[indexName, '=', id]]);
  }

  async deleteItems(ids, indexName = null) {
    ids.forEach(id => {
      this.delete(id, indexName)
    });
  }

  async lastId(column = 'id') {
    return await this.getMax(this.tb_name, column);
  }

}

module.exports = Model