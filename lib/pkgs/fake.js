const bcrypt = require('bcrypt');

class Fake {

  Model;
  data = {
    'inserts': [],
    'updates': [],
    'deletes': [],
  }
  logInfo;

  constructor(model_name) {
    this.Model = new (require(`../../services/models/${model_name}_model`))();
  }

  insert(values) {
    this.data.inserts.push(values);
  }

  update(values, itemId) {
    this.data.updates.push([itemId, values]);
  }

  delete(itemId) {
    this.data.deletes.push(itemId);
  }
  
  createPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  random(from, to = null) {
    if (to) return Math.floor(Math.random(from, to) * to);
    else return Math.floor(Math.random(from) * from);
  }

  async execute() {
    for (let insertItemId = 0; insertItemId < this.data.inserts.length; insertItemId++) {
      await this.Model.create(this.data.inserts[insertItemId]);
    }
    for (let updateItemId = 0; updateItemId < this.data.updates.length; updateItemId++) {
      await this.Model.update(...this.data.updates[updateItemId]);
    }
    for (let deleteItemId = 0; deleteItemId < this.data.deletes.length; deleteItemId++) {
      await this.Model.delete(this.data.deletes[deleteItemId]);
    }
  }

}

module.exports = Fake;