/* global document:false, appUrl:false, ajaxFunctions:false */

'use strict';

(function () {
  var locationName = document.querySelector('#serp-location');
  var results = document.querySelector('#serp-results');
  var apiUrl = appUrl + '/api/search' + document.location.search;

  function makeLI(obj) {
    var img = document.createElement('img');
    img.src = obj.imageUrl;
    var name = document.createTextNode(obj.name);
    var link = document.createElement('a');
    link.href = obj.url;
    link.appendChild(img);
    link.appendChild(name);
    var going = document.createTextNode(' has ' + obj.count + ' going');

    var goingUrl = appUrl + '/api/toggle/' + obj.id;
    var button = document.createElement('button');
    button.appendChild(document.createTextNode('I\'m ' + (obj.going ? 'not ' : '') + 'going'));
    button.hidden = true;
    button.className = 'auth-shown';
    button.addEventListener('click', () => {
      ajaxFunctions.ajaxRequest('POST', goingUrl, () => {
        ajaxFunctions.ajaxRequest('GET', apiUrl, updateResults);
      });
    });

    var li = document.createElement('li');
    li.appendChild(link);
    li.appendChild(going);
    li.appendChild(button);
    return li;
  }

  function updateResults(data) {
    var serpData = JSON.parse(data);
    results.innerHTML = '';
    serpData.map(makeLI).forEach(li => results.appendChild(li));
  }

  ajaxFunctions.ready(() => {
    locationName.innerText = decodeURIComponent(document.location.search.replace('?location=', '').replace('+', ' '));
    ajaxFunctions.ajaxRequest('GET', apiUrl, updateResults);
  });
})();
