const Controller = require('../../../../lib/pkgs/controller');
const Environment = require('../../../../src/environment');
const UserModel = require('../../../models/user_model');

class UserController extends Controller{

  static async filterUsers(users, type, _getRows = true) {
    const userModel = new UserModel();
    if (_getRows) users = await UserController.getRows(users, userModel, type != 'delete');
    var nUsers = type == 'delete' ? [] : {};
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (type == 'delete') {
        nUsers.push(user.id);
      } else {
        nUsers[user.id] = user;
      }
    }
    return nUsers;
  }

  static async onUsersUpdate(event) {
    for (var userId in Environment.socketClients.admin) {
      const socketClient = Environment.socketClients.admin[userId];
      if (socketClient.events && socketClient.events.indexOf('users') != -1) {
        var users = await UserController.filterUsers(
          event.affectedRows,
          event.type.toLowerCase(),
        );
        UserController.emitUsers(socketClient, event.type.toLowerCase(), users);
      }
    }
  }

  static async getAll() {
    return await new UserModel().all(true, true);
  }

  static async sendData(socketClient) {
    UserController.emitUsers(
      socketClient,
      'insert',
      await UserController.filterUsers(
        await UserController.getAll(),
        'insert',
        false
      ),
    );
  }

  static emitUsers(socketClient, type, users) {
    socketClient.emit('users-update', type, users);
  }

  static async createUser(socketClient, userValues) {
    if (socketClient.user.permissions.user.c) {
      const userModel = new UserModel();
      var success = false;
      var message = null;
      try {
        if (!userValues.firstname) {
          message = 'الاسم مطلوب';
        } else {
          var address = [];
          if (userValues.country) {
            address.push(userValues.country);
            if (userValues.state) address.push(userValues.state);
          }
          if (userValues.address) address.push(userValues.address);
          var values = {
            family_id: userValues.family_id,
            firstname: userValues.firstname,
            phone: userValues.phone,
            email: userValues.email,
            address: address.join(', '),
            more_data: userValues.more_data,
          }
          values.job = userValues.job;
          if (values.job == 'student') {
            values.job_data = {
              'collage': userValues.student_collage,
              'speciality': userValues.student_speciality,
              'level': userValues.student_level,
            }
          } else if (values.job == 'worker') {
            values.job_data = {
              'name': userValues.job_name,
              'address': userValues.job_address,
            }
          }
          await userModel.create(values);
          message = 'تم تسجيل المستخدم بنجاح';
          success = true;
        }
      } catch (error) {
        console.log(error);
        message = 'خطأ أثناء تسجيل المستخدم';
      }
      socketClient.emit('user-create-result', success, message);
    } else {
      socketClient.emit('user-create-result', false, 'ليس لديك صلاحية لهذه العملية');
    }
  }

  static async updateUser(socketClient, userValues) {
    if (socketClient.user.permissions.user.u) {
      const userModel = new UserModel();
      var success = false;
      var message = null;
      if (userValues.id && await userModel.find(userValues.id)) {
        try {
          var address = [];
          if (userValues.country) {
            address.push(userValues.country);
            if (userValues.state) address.push(userValues.state);
          }
          if (userValues.address) address.push(userValues.address);
          var values = {
            family_id: userValues.family_id,
            firstname: userValues.firstname,
            phone: userValues.phone,
            email: userValues.email,
            address: address.join(', '),
            more_data: userValues.more_data,
          }
          values.job = userValues.job;
          if (values.job == 'student') {
            values.job_data = {
              'collage': userValues.student_collage,
              'speciality': userValues.student_speciality,
              'level': userValues.student_level,
            }
          } else if (values.job == 'worker') {
            values.job_data = {
              'name': userValues.job_name,
              'address': userValues.job_address,
            }
          }
          await userModel.update(userValues.id, values);
          message = 'تم تحديث بيانات المستخدم بنجاح';
          success = true;
        } catch (error) {
          console.log(error)
          message = 'خطأ أثناء تحديث بيانات المستخدم';
        }
      } else {
        message = 'لا يوجد مستخدم بهذا المعرف';
      }
      socketClient.emit('user-update-result', success, message);
    } else {
      socketClient.emit('user-update-result', false, 'ليس لديك صلاحية لهذه العملية');
    }
  }

  static async deleteUser(socketClient, userId) {
    if (socketClient.user.permissions.user.d) {
      const userModel = new UserModel();
      var success = false;
      var message = null
      try {
        if ((await userModel.delete(userId)).affectedRows > 0) {
          message = 'تم حذف المستخدم بنجاح';
          success = true;
        } else {
          message = 'لا يوجد مستخدم بهذا المعرف';
        }
      } catch (error) {
        console.log(error)
        message = 'خطأ أثناء حذف المستخدم';
      }
      socketClient.emit('user-delete-result', success, message);
    } else {
      socketClient.emit('user-delete-result', false, 'ليس لديك صلاحية لهذه العملية');
    }
  }

  static async deleteUsers(socketClient, usersIds) {
    if (socketClient.user.permissions.user.d) {
      const userModel = new UserModel();
      var success = false;
      var message = null
      try {
        await userModel.deleteItems(usersIds);
        message = 'تم حذف المستخدمين بنجاح';
        success = true;
      } catch (error) {
        console.log(error)
        message = 'خطأ في عملية الحذف';
      }
      socketClient.emit('users-delete-result', success, message);
    } else {
      socketClient.emit('users-delete-result', false, 'ليس لديك صلاحية لحذف لهذه العملية');
    }
  }

}

module.exports = UserController;