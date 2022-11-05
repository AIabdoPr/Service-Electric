
const Environment = require('../../src/environment');
const ListenerException = require('./hundler/listener_exception');

class Controller {

  static setupListener(tb_name, func, type = '*') {
    Controller.addListenerFunc(tb_name, func, type);
  }

  static async getRows(rows, model, after = true) {
    var _rows = [];
    rows.forEach(row => {
      if (after) {
        _rows.push(row.after);
      }
      else _rows.push(row.before);
    });
    if (after) {
      try {
        _rows = await model.render(_rows, true);
      } catch (error) {
        console.log(_rows)
      }
    }
    return _rows;
  }
  
  static addListenerFunc(listenerName, func, type = '*') {
    var eventTypes = ['insert', 'update', 'delete'];
    if (type = '*') {
      eventTypes.forEach(_type => {
        if (Environment.databaseListenersFuncs[_type][listenerName] == undefined) Environment.databaseListenersFuncs[_type][listenerName] = [];
        Environment.databaseListenersFuncs[_type][listenerName].push(func);
      });
    } else {
      if (eventTypes.indexOf(type) == -1) {
        throw new ListenerException(`Incorrect Type (${type})`);
      }
      if (Environment.databaseListenersFuncs[type][listenerName] == undefined) Environment.databaseListenersFuncs[type][listenerName] = [];
      Environment.databaseListenersFuncs[type][listenerName].push(func);
    }
  }

  static removeListener(listenerName, type) {
    delete(Environment.databaseListenersFuncs[type][listenerName]);
  }

  static removeListenerFunc(listenerName, type, funcId) {
    if (Environment.databaseListenersFuncs[type][listenerName] != undefined && Environment.databaseListenersFuncs[type][listenerName][funcId] != undefined) {
      delete(Environment.databaseListenersFuncs[type][listenerName][funcId]);
    }
  }
}

module.exports = Controller;