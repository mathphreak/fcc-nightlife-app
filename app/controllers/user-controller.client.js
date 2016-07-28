/* global document:false, appUrl:false, ajaxFunctions:false */

'use strict';

(function () {
  var displayName = document.querySelector('#display-name');
  var apiUrl = appUrl + '/api/me';

  var authDetailedStyle = document.createElement('style');

  ajaxFunctions.ready(() => ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
    document.body.appendChild(authDetailedStyle);

    var userObject = JSON.parse(data);

    if (userObject === false) {
      return;
    }

    authDetailedStyle.sheet.insertRule('.auth-hidden {display: none;}', 0);
    authDetailedStyle.sheet.insertRule('.auth-shown {display: unset;}', 0);

    displayName.innerHTML = userObject.displayName || userObject.username;
  }));
})();
