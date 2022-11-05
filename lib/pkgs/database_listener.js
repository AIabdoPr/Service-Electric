const Consts = require('../../src/consts');
const MyDatabaseListener = require('./my_database_listener');
const Environment = require('../../src/environment');
const MySQLEvents = require('@rodrigogs/mysql-events');

class DatabaseListener {

  
  mySQLEvents;
  myDatabaseListener;

  constructor() {
    // this.myDatabaseListener = new MyDatabaseListener(Consts.DB_DNS)
    this.mySQLEvents = new MySQLEvents(Consts.DB_DNS, {startAtEnd: true});
    this.start();
  }

  async start() {
    // this.myDatabaseListener.addTrigger(
    //   'advanced_server_database_listener',
    //   `${Consts.DB_DATABASE}.*`,
    //   (event) => {
    //     if (Environment.databaseListenersFuncs[event.type.toLowerCase()][event.table] != undefined) {
    //       Environment.databaseListenersFuncs[event.type.toLowerCase()][event.table].forEach(func => {
    //         func(event, event.type.toLowerCase());
    //       });
    //     }
    //   }
    // );
    // this.myDatabaseListener.start();
    await this.mySQLEvents.start();
    this.mySQLEvents.addTrigger({
      name: 'monitoring all statments',
      expression: `${Consts.DB_DATABASE}.*`,
      statement: MySQLEvents.STATEMENTS.ALL,
      onEvent: event => {
        console.log(event);
        if (Environment.databaseListenersFuncs[event.type.toLowerCase()][event.table] != undefined) {
          Environment.databaseListenersFuncs[event.type.toLowerCase()][event.table].forEach(func => {
            func(event, event.type.toLowerCase());
          });
        }
      }
    });
    this.mySQLEvents.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    this.mySQLEvents.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  }

}

module.exports = DatabaseListener;