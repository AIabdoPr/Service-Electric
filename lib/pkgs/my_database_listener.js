const ZongJi = require("zongji");

class Action {

  types = {
    writerows: 'insert',
    updaterows: 'update',
    deleterows: 'delete',
  }

  tablemap;
  action;
  actionName;

  constructor(tablemap) {
    this.tablemap = tablemap;
  }

  render() {
    var actionVals = {};
    actionVals.database = this.tablemap.schemaName;
    actionVals.table = this.tablemap.tableName;
    actionVals.type = this.types[this.actionName];
    actionVals.rows = this.action.rows;
    actionVals.timestamp = this.tablemap.timestamp;
    return actionVals;
  }

}

class MyDatabaseListener {

  zongji;
  target;
  currentAction;
  triggers = {};

  constructor(dns) {
    // dns.debug = true;
    this.zongji = new ZongJi(dns);
    this.zongji.on('binlog', (e) => this.onBinLog(e));
    this.zongji.on('error', (e) => console.error(e));
    this.zongji.on('stopped', (e) => console.log('zogji stopped', e));
  }

  start() {
    return this.zongji.start();
  }

  stop() {
    return this.zongji.stop();
  }

  onBinLog(evt) {
    // if (evt.timestamp > Date.now() - 1000) {
      var eventName = evt.getEventName();
      if (eventName === 'tablemap') this.currentAction = new Action(evt);
      if (['writerows', 'updaterows', 'deleterows'].indexOf(eventName) != -1 && !this.currentAction.action) {
        this.currentAction.action = evt;
        this.currentAction.actionName = eventName;
        console.log(this.currentAction.render());
        // this.onLog(this.currentAction.render());
      }
    // }
  }

  onLog(action) {
    for (const triggerName in this.triggers) {
      const trigger = this.triggers[triggerName];
      if (trigger.target == "*") trigger.callback(action);
      else if (trigger.target == `${action.database}.*`) trigger.callback(action);
      else if (trigger.target == `${action.database}.${action.table}.*`) trigger.callback(action);
      else if (trigger.target == `${action.database}.${action.table}.${action.type}`) trigger.callback(action);
    }
  }

  addTrigger(name, target, callback) {
    this.triggers[name] = {
      target: target,
      callback: callback,
    };
  }

}

module.exports = MyDatabaseListener;