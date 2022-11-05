class Response {

  request;
  response;

  hundlers = {
    404: {
      title: '404 - Page not found',
      message: 'Page not found',
    },
    400: {
      title: '400 - Bad request',
      message: 'Bad request',
    }
  }

  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  render(view, args = {}, ..._args) {
    args.hostUrl = this.request.getRequestHostUrl();
    this.response.render(view, args, ..._args);
  }

  send(...args) {return this.response.send(...args);}
  download(...args) {return this.response.download(...args);}
  json(...args) {return this.response.json(...args);}
  redirect(...args) {return this.response.redirect(...args);}
  status(code, message = null) {
    this.response.status(code);
    if (this.request.request.accepts('html')) {
      var args = this.hundlers[code];
      if (message) args.message = message;
      else args.message.replace('{{ url }}', this.request.getRequestHostUrl());
      args.code = code;
      return this.render('hundler', args);
    } else if (this.request.request.accepts('json')) {
      return this.json({ error: args.message });
    } else {
      return this.type('txt').send(args.message);
    }
  }
  cookie(...args) {return this.response.cookie(...args);}

}

module.exports = Response;