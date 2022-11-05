import { Collection } from "./scripts->storage_database->collection.js";
import { StorageListener } from "./scripts->storage_database->storage_listener.js";

class StorageDatabase {

  storageListener;
  storage;

  constructor() {
    this.storageListener = new StorageListener(this);
    this.storage = {}
  }

  haveCollectionId(collectionId) {
    return this.storage[collectionId] != undefined;
  }

  collection(collectionId) {
    return new Collection(collectionId, this, this.storageListener);
  }

  remove(collectionId) {
    delete this.storage[collectionId];
  }

}

export default StorageDatabase;

window.StorageDatabase = new StorageDatabase();