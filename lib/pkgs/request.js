class Request extends Object {

  request;
  cookies;
  type;
  token;
  allData = {};
  files;
  user;
  session;

  constructor(request) {
    super();
    this.request = request;
    this.type = this.request.method;
    this.cookies = this.request.cookies;
    this.marge();
    this.files = request.files;
    this.session = request.session;
  }

  marge() {
    if (this.request.query) {
      for (const queryKey in this.request.query) {
        this[queryKey] = this.request.query[queryKey];
        this.allData[queryKey] = this.request.query[queryKey];
      }
    }
    if (this.request.params) {
      for (const paramKey in this.request.params) {
        this[paramKey] = this.request.params[paramKey];
        this.allData[paramKey] = this.request.params[paramKey];
      }
    }
    if (this.request.body) {
      for (const bodyKey in this.request.body) {
        this[bodyKey] = this.request.body[bodyKey];
        this.allData[bodyKey] = this.request.body[bodyKey];
      }
    }
    if(this.request.fields) {
      for (const fieldKey in this.request.fields) {
        this[fieldKey] = this.request.fields[fieldKey];
        this.allData[fieldKey] = this.request.fields[fieldKey];
      }
    }
  }

  addValue(key, value) {
    this[key] = value;
    this.allData[key] = value;
  }

  getRequestHostUrl() {
    return `${this.request.protocol}://${this.request.get('host')}`;
  }

  getRequestUrl() {
    return `${this.getRequestHostUrl()}${this.request.originalUrl}`;
  }

}

module.exports = Request