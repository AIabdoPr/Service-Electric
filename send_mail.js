const sendgrid = require('@sendgrid/mail');

const API_KEY = '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';

sendgrid.setApiKey(API_KEY);

sendgrid.send({
  to: {
    email: 'a7med3ali47@gmail.com',
    name: 'a7med3ali',
  },
  from: {
    email: 'abdopr47@gmail.com',
    name: 'abdo',
  },
  templateId: 'd-04abdbed461f4f01b4e5a71c8292cd62',
  dynamicTemplateData: {
    message: 'Well Done'
  }
}).then(() => {
  console.log('email sent');
}).catch(err => {
  console.log(err.response.body);
});