const Fake = require("../../../lib/pkgs/fake");

class AdminsFake extends Fake {

  // logInfo = "some log infos";

  constructor() {
    super("admin");
    this.setup();
  }

  setup() {
    this.insert({
      user_id: 1,
      password: this.createPassword('12345678'),
      permissions: {
        user: {
          c: true,
          r: true,
          u: true,
          d: true,
        },
      }
    });
    this.insert({
      user_id: 2,
      password: this.createPassword('123456'),
      permissions: {
        user: {
          c: false,
          r: true,
          u: false,
          d: false,
        }
      }
    });
  }

}

module.exports = AdminsFake