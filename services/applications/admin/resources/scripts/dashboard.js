import { io } from '../general/scripts->socket.io.esm.min.js';

window.permissions = JSON.parse(CryptoJS.AES.decrypt(permissions, document.cookie.replace('adminAuth=', '')).toString(CryptoJS.enc.Utf8));

const socket = io.connect('', {
  path: '/admin-socket/',
  autoConnect: false,
});

function updateTable(users, type, tableId) {
  var jobNames = {worker: 'عامل', student: 'طالب', retired: 'متقاعد'};
  var table = initTable(`#${tableId} table`);
  $(`#${tableId} table thead input[type="checkbox"].select-all`).prop('checked', false);
  if (users && type == 'delete') {
    users.forEach(userId => {
      table.row(`#${tableId}-item-${userId}`).remove().draw();
    });
  } else if (users && type == 'insert') {
    for (const userId in users) {
      var row = [];
      if (permissions.user.d) {
        row.push(
          `<td>
            <span class="custom-checkbox">
              <input type="checkbox" id="${tableId}-chb-${userId}">
              <label for="${tableId}-chb-${userId}"></label>
            </span>
          </td>`);
      }
      row.push(`<td>${userId}</td>`);
      row.push(`<td>${users[userId].firstname}</td>`);
      row.push(`<td>${users[userId].family.name}</td>`);
      row.push(`<td>${users[userId].phone || 'فارغ'}</td>`);
      row.push(`<td>${users[userId].email || 'فارغ'}</td>`);
      if (tableId == 'all-users') {
        row.push(`<td>${users[userId].address || 'فارغ'}</td>`);
        row.push(`<td>${jobNames[users[userId].job] || 'فارغ'}</td>`);
      } else if (tableId == 'all-students') {
        row.push(`<td>${users[userId].job_data.collage || 'فارغ'}</td>`);
        row.push(`<td>${users[userId].job_data.speciality || 'فارغ'}</td>`);
      } else if (tableId == 'all-retirees') {
        row.push(`<td>${users[userId].address || 'فارغ'}</td>`);
      } else if (tableId == 'all-workers') {
        row.push(`<td>${users[userId].job_data.name || 'فارغ'}</td>`);
        row.push(`<td>${users[userId].job_data.company || 'فارغ'}</td>`);
      }
      row.push(`<td>${formatDate(new Date(users[userId].created_at))}</td>`);
      var actions = [];
      if (permissions.user.r) {
        actions.push(`
          <button class="btn btn-icon btn-secondary" action="view-user">
            <span class="material-symbols-sharp">open_in_new</span>
          </button>`);
      }
      if (permissions.user.u) {
        actions.push(`
          <button class="btn btn-icon btn-warning" action="edit-user">
            <span class="material-symbols-sharp">edit</span>
          </button>`);
      }
      if (permissions.user.d) {
        actions.push(`
          <button class="btn btn-icon btn-danger" action="delete-user">
            <span class="material-symbols-sharp">delete</span>
          </button>`);
      }
      if (actions.length > 0) row.push(`<td>${actions.join('')}</td>`);
      table.row.add(row).node().id = `${tableId}-item-${userId}`;
      table.draw();
    }
  } else if (users && type == 'update') {
    for (const userId in users) {
      var rowData = table.row(`#${tableId}-item-${userId}`).data();
      rowData[2] = users[userId].firstname;
      rowData[3] = users[userId].family.name;
      rowData[4] = users[userId].phone;
      rowData[5] = users[userId].email;
      if (tableId == 'all-users') {
        rowData[6] = users[userId].address;
        rowData[7] = jobNames[users[userId].job];
      } else if (tableId == 'all-students') {
        rowData[6] = users[userId].job_data.collage;
        rowData[7] = users[userId].job_data.speciality;
      } else if (tableId == 'all-retirees') {
        rowData[6] = users[userId].address;
      } else if (tableId == 'all-workers') {
        rowData[6] = users[userId].job_data.name;
        rowData[7] = users[userId].job_data.address;
      }
      rowData[8] = formatDate(new Date(users[userId].created_at));
      table.row(`#${tableId}-item-${userId}`).data(rowData).draw();
    }
  }
}

async function changeTab(tabName) {
  $('#tab-loading').attr('class', 'loading show');
  $('#tab-content').attr('class', 'hide');
  if (!tabName) tabName = 'users';
  $(`#tab-content .tab-view-tab-item`).removeClass('selected');
  $(`#tab-content .tab-view-tab-item[for="${tabName}"]`).addClass('selected');
  $(`.sidebar .sidebar-item`).attr('class', 'sidebar-item');
  $(`.sidebar #${tabName}`).attr('class', 'sidebar-item active');
  window.history.pushState('', '', `?tab=${tabName}`);
  // await delay(500);
  $('#tab-loading').attr('class', 'loading hide');
  $('#tab-content').attr('class', 'show');
  window.currentTabName = tabName;
}

function loadFormValues(formId, userValues) {
  $(`${formId} .multi-input .multi-input-body`).html('');
  $(`${formId} .modal-body .form-control[name="family_id"]`).val(userValues.family_id);
  $(`${formId} .modal-body .form-control[name="firstname"]`).val(userValues.firstname);
  $(`${formId} .modal-body .form-control[name="phone"]`).val(userValues.phone);
  $(`${formId} .modal-body .form-control[name="email"]`).val(userValues.email);
  const country = userValues.address.indexOf(', ') != -1 ? userValues.address.split(', ')[0] : undefined;
  const state = userValues.address.indexOf(', ') != -1 ? userValues.address.split(', ')[1] : undefined;
  const address = userValues.address.indexOf(', ') != -1 ? userValues.address.split(', ')[2] : undefined;
  if (country) {
    $(`${formId} .modal-body select[name="country"]`).val(country).change();
    $(`${formId} .modal-body select[name="state"] option[value="${state}"]`).attr('selected', true);
  } else {
    $(`${formId} .modal-body select[name="country"]`).val('').change();
  }
  $(`${formId} .modal-body .form-control[name="address"]`).val(address || userValues.address);
  $(`${formId} .modal-body select[name="user-job"]`).val(userValues.job).change();
  if (userValues.job == 'student') {
    $(`${formId} .modal-body .form-control[name="student_collage"]`).val(userValues.job_data.collage);
    $(`${formId} .modal-body .form-control[name="student_speciality"]`).val(userValues.job_data.speciality);
    $(`${formId} .modal-body .form-control[name="student_level"]`).val(userValues.job_data.level);
  } else if (userValues.job == 'worker') {
    $(`${formId} .modal-body .form-control[name="job_name"]`).val(userValues.job_data.name);
    $(`${formId} .modal-body .form-control[name="job_address"]`).val(userValues.job_data.address);
  }
  if (userValues.is_married) {
    $(`${formId} .modal-body input[name="is_married"]`).prop('checked', true);
    userValues.children.forEach(child => {
      addMultiInputItem(`${formId} .modal-body .multi-input`, child);
    });
  }
  if (userValues.more_data) {
    userValues.more_data.forEach(item => {
      addMultiInputItem(`${formId} .modal-body .multi-input`, item);
    });
  }
}

function onConnect() {
  window.currentTabName = $_GET('tab') || 'users'
  changeTab(currentTabName);

  StorageDatabase.collection('users').set({});
  StorageDatabase.collection('students').set({});
  StorageDatabase.collection('retirees').set({});
  StorageDatabase.collection('workers').set({});
  socket.emit('start-listener', 'user');

  socket.on('users-update', (requestId, type, users) => {
    if (type == 'delete') {
      users.forEach(userId => {
        ['users', 'students', 'retirees', 'workers'].forEach(collectionId => {
          const collection = StorageDatabase.collection(collectionId);
          if (collection.haveDocId(userId)) {
            collection.remove(userId);
            updateTable([userId], 'delete', `all-${collectionId}`);
          }
        });
      });
    } else {
      var students = {};
      var retirees = {};
      var workers = {};
      for (const userId in users) {
        if (users[userId].job == 'student') {
          StorageDatabase.collection('students').doc(userId).set(users[userId]);
          students[userId] = users[userId];
        } else if (users[userId].job == 'retired') {
          StorageDatabase.collection('retirees').doc(userId).set(users[userId]);
          retirees[userId] = users[userId];
        } else if (users[userId].job == 'worker') {
          StorageDatabase.collection('workers').doc(userId).set(users[userId]);
          workers[userId] = users[userId];
        }
        StorageDatabase.collection('users').doc(userId).set(users[userId]);
      }
      updateTable(users, type, 'all-users');
      updateTable(students, type, 'all-students');
      updateTable(retirees, type, 'all-retirees');
      updateTable(workers, type, 'all-workers');
    }
  });

  socket.on('user-create-result', (_, success, message) => {
    alertMessage(`create-user-${Date.now()}`, success ? 'نجاح:' : 'خطأ:', message, success ? 'success' : 'danger');
    $('#users-add button[action="add-user"]').html('إضافة الشخص').attr('disabled', false);
    $('#users-add input').val('');
    $('#users-add select option').attr('selected', false);
    $('#users-add select option:first-child').prop('selected', true).change();
    $('#users-add input[type="checkbox"]').prop('checked', false);
  });

  socket.on('user-update-result', (_, success, message) => {
    alertMessage(`update-user-${Date.now()}`, success ? 'نجاح:' : 'خطأ:', message, success ? 'success' : 'danger');
    $('#edit-user .modal-footer button.btn[action="user-save-edit"]').attr('disabled', false).html('حفظ التغييرات');
    if (success) {
      $('#edit-user').modal('hide');
      $('#edit-user input').val('');
      $('#edit-user select option').attr('selected', false);
      $('#edit-user select option:first-child').prop('selected', true).change();
      $('#edit-user input[type="checkbox"]').prop('checked', false);
    }
  });

  socket.on('user-delete-result', (_, success, message) => {
    alertMessage(`delete-user-${Date.now()}`, success ? 'نجاح:' : 'خطأ:', message, success ? 'success' : 'danger');
  });

  socket.on('users-delete-result', (_, success, message) => {
    alertMessage(`deletes-users-${Date.now()}`, success ? 'نجاح:' : 'خطأ:', message, success ? 'success' : 'danger');
  });

  $on('.sidebar .sidebar-item', 'click', function() {
    if ($(this).attr('class').indexOf('active') != -1) return;
    changeTab($(this).attr('id'));
  });
  displayBodyContent();
}

$(document).ready(function() {
  socket.connect()
  socket.on('connect_error', (err) => {
    $('#body-loading .loading-message').css('display', 'block').html(`خطأ في الإتصال:<br> ${err.toString().replace('Error:', '')}`);
  });
  socket.on('disconnect', function () {
    console.log('Disconnected');
  });
  socket.on('connect_failed', (err) => {
    console.log(`Connect failed: ${err}`);
  });
  socket.on('connect', onConnect);
  $on('#person-dropdown', 'onSelect[value="account"]', function(event, item) {
    console.log('goto account')
  });
});

$on('#tab-content .custom-table-header .custom-table-header-actions button[action="delete"]', 'click', function() {
  const tableId = getElementparent(this, 3).id;
  const inputs = $(getElementparent(this, 3)).find('table tbody tr input:checked');
  var usersIds = [];
  for (let i = 0; i < inputs.length; i++) {
    usersIds.push(inputs[i].id.replace(`${tableId}-chb-`, ''));
  }
  const btnHtml = $(this).html();
  $(this).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>يرجى الانتظار...`);
  $(this).attr('disabled', true);
  messageDialog(
    'delete-user',
    'حذف الأفراد',
    'هل أنت متأكد من حذف هؤلاء الأفراد؟',
    (action) => {
      if (action == 'نعم') socket.emit('delete-users', usersIds);
      $('#message-dialog-modal').modal('hide');
    },
    {نعم: 'primary'},
    'إلغاء',
    () => {
      $(this).html(btnHtml);
      $(this).attr('disabled', false);
    }
  );  
});

$on('#tab-content table tr td button[action="view-user"]', 'click', function () {
  const tableId = getElementparent(this, 8).id;
  const rowId = getElementparent(this, 2).id.replace(`${tableId}-item-`, '');
  const user = StorageDatabase.collection('users').doc(rowId).get();
  loadFormValues('#view-user', user);

  $('#view-user .modal-title #view-user-id').html(rowId);
  $('#view-user select').prop('disabled', true);
  $('#view-user input').prop('disabled', true);
  $('#view-user textarea').prop('disabled', true);
  $('#view-user button').prop('disabled', true);
  $('#view-user').modal('show');
});

$on('#tab-content table tr td button[action="edit-user"]', 'click', function () {
  const tableId = getElementparent(this, 8).id;
  const rowId = getElementparent(this, 2).id.replace(`${tableId}-item-`, '');
  const user = StorageDatabase.collection('users').doc(rowId).get();
  loadFormValues('#edit-user', user);
  
  $('#edit-user .modal-title #edit-user-id').html(rowId);
  $('#edit-user').modal('show');
});

$on('#tab-content table tr td button[action="delete-user"]', 'click', function () {
  const tableId = getElementparent(this, 8).id;
  const rowId = getElementparent(this, 2).id.replace(`${tableId}-item-`, '');
  const btnHtml = $(this).html();
  $(this).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
  $(this).attr('disabled', true);
  messageDialog(
    'delete-user',
    'حذف الفرد',
    'هل أنت متأكد من حذف الفرد؟',
    (action) => {
      if (action == 'نعم') socket.emit('delete-user', rowId);
      $('#message-dialog-modal').modal('hide');
    },
    {نعم: 'primary'},
    'إلغاء',
    () => {
      $(this).html(btnHtml);
      $(this).attr('disabled', false);
    }
  );
});

$on('#edit-user .modal-footer button[action="user-save-edit"]', 'click', function() {
  const btn = $('#edit-user .modal-footer button[action="user-save-edit"]');
  btn.attr('disabled', true);
  btn.html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    يرجى الإنتظار...
  `);

  var userValues = {
    id: $('#edit-user #edit-user-id').html(),
    family_id: $('#edit-user .form-control[name="family_id"]').val(),
    firstname: $('#edit-user .form-control[name="firstname"]').val(),
    phone: $('#edit-user .form-control[name="phone"]').val(),
    email: $('#edit-user .form-control[name="email"]').val(),
    country: $('#edit-user .form-control[name="country"]').val(),
    state: $('#edit-user .form-control[name="state"]').val(),
    address: $('#edit-user .form-control[name="address"]').val(),
  };

  userValues.isMarried = $('#edit-user #edit-user-is-married')[0].checked;
  if (userValues.isMarried) {
    userValues.children = getMultiInputValues('#edit-user #edit-user-user-children')
  }
  userValues.job = $('#edit-user #edit-user-user-job select').val();
  if (userValues.job == 'worker') {
    setObjectValueIfExists(userValues, 'job_name', $('#edit-user #edit-user-user-job input[name="job_name"]').val());
    setObjectValueIfExists(userValues, 'job_address', $('#edit-user #edit-user-user-job input[name="job_address"]').val());
  } else if (userValues.job == 'student') {
    setObjectValueIfExists(userValues, 'student_collage', $('#edit-user #edit-user-user-job input[name="student_collage"]').val());
    setObjectValueIfExists(userValues, 'student_speciality', $('#edit-user #edit-user-user-job input[name="student_speciality"]').val());
    setObjectValueIfExists(userValues, 'student_level', $('#edit-user #edit-user-user-job input[name="student_level"]').val());
  }
  userValues.more_data = getMultiInputValues('#edit-user #edit-user-more-data');
  socket.emit('update-user', userValues);
});

$on('.create-modal button.btn', 'click', function() {
  var inputs = $(getElementparent(this, 4)).find('.form-control');
  var userValues = {};
  for (let i = 0; i < inputs.length; i++) {
    const input = $(inputs[i]);
    userValues[input.attr('name')] = input.val();
  }
  console.log($(this).attr('action'), userValues)
  socket.emit($(this).attr('action'), userValues);
});

$on('#users-add', 'keydown', (event) => {
  if (event.keyCode == 13) {
    $('#users-add button[action="add-user"]').focus();
  }
});

$on('#users-add button[action="add-user"]', 'click', async function() {
  $(this).html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    يرجى الإنتظار...
  `);
  $(this).attr('disabled', true);
  var userValues = {
    family_id: $('#users-add .form-control[name="family_id"]').val(),
    firstname: $('#users-add .form-control[name="firstname"]').val(),
    phone: $('#users-add .form-control[name="phone"]').val(),
    email: $('#users-add .form-control[name="email"]').val(),
    country: $('#users-add .form-control[name="country"]').val(),
    state: $('#users-add .form-control[name="state"]').val(),
    address: $('#users-add .form-control[name="address"]').val(),
  };

  userValues.isMarried = $('#is-married')[0].checked;
  if (userValues.isMarried) {
    userValues.children = getMultiInputValues('#user-children')
  }
  userValues.job = $('#users-add #user-job select').val();
  if (userValues.job == 'worker') {
    setObjectValueIfExists(userValues, 'job_name', $('#users-add #user-job input[name="job_name"]').val());
    setObjectValueIfExists(userValues, 'job_address', $('#users-add #user-job input[name="job_address"]').val());
  } else if (userValues.job == 'student') {
    setObjectValueIfExists(userValues, 'student_collage', $('#users-add #user-job input[name="student_collage"]').val());
    setObjectValueIfExists(userValues, 'student_speciality', $('#users-add #user-job input[name="student_speciality"]').val());
    setObjectValueIfExists(userValues, 'student_level', $('#users-add #user-job input[name="student_level"]').val());
  }
  userValues.more_data = getMultiInputValues('#users-add #more-data');
  // await delay(300);
  socket.emit('create-user', userValues);
});