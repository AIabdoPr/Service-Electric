const Fake = require('../../../lib/pkgs/fake');

class UserFake extends Fake {

  // logInfo = 'some log infos';

  constructor() {
    super('user');
    this.setup();
  }

  setup() {
    this.insert({
      firstname: 'عبدالرحمن بن مصطفى بن صالح بن يحيى',
      family_id: 1,
      phone: '0778185797',
      email: 'abdopr47@gmail.com',
      address: 'Algeria, Ghardaia, Berriane',
      job: 'student',
      job_data: {
        collage: 'جامعة غرداية',
        level: 'الاولى',
        speciality: 'العوم والتكنلوجيا',
      },
      more_data: [{"value": "يملك مهارة في البرمجة"}],
    });
    this.insert({
      firstname: 'guest',
      family_id: 1,
      phone: '0778185797',
      email: 'guest-1@admin.com',
      address: 'Algeria, Ghardaia, Berriane',
      job: 'student',
      job_data: {
        collage: 'جامعة غرداية',
        level: 'الاولى',
        speciality: 'العوم والتكنلوجيا',
      }
    });
  }

}

module.exports = UserFake