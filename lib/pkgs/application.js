const fs = require('fs');
const Consts = require('../../src/consts');
const Environment = require('../../src/environment');

class Application {

  appId = '';

  _middlewares = [];
  _routes = [];

  constructor(appId) {
    this.appId = appId;
  }

  addItems(target, nItems, replace = false) {
    if (replace) {
      this[`_${target}`] = nItems;
    } else {
      this[`_${target}`] = this[`_${target}`].concat(nItems);
    }
  }

  addItem(target, item) {
    this.addItems(target, [item]);
  }

  setupItems(target) {
    if (fs.existsSync(`${Consts.APPLICATIONS_PATH}${this.appId}/${target}`)) {
      fs.readdirSync(`${Consts.APPLICATIONS_PATH}${this.appId}/${target}`).forEach(item => {
        var _class = require(`${Consts.APPLICATIONS_PATH}${this.appId}/${target}/${item}`);
        this.addItem(target, new _class());
      });
    }
  }

  store() {
    this.setupItems('middlewares');
    this.storeItems(this._middlewares);
    this.setupItems('routes');
    this.storeItems(this._routes);
    if (fs.existsSync(`${Consts.APPLICATIONS_PATH}${this.appId}/resources`)) {
      Environment.storages[this.appId] = `${Consts.APPLICATIONS_PATH}${this.appId}/resources`;
    }
  }

  storeItems(items) {
    items.forEach(item => {
      item.store();
    });
  }

}

module.exports = Application