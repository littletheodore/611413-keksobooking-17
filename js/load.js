'use strict';

(function () {
  var TIMEOUT = 10000;

  window.load = function (method, URL, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === window.StatusCodes.Success) {
        onSuccess(xhr.response);
      } else {
        if (method === 'GET') {
          onError('Статус ответа' + xhr.status);
        }
      }
    });
    xhr.addEventListener('error', function () {
      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      if (xhr.timeout > TIMEOUT) {
        onError('Сервер не отвечает в течение' + xhr.timeout + 'мс');
      }
    });
    xhr.open(method, URL);
    xhr.send(data);
  };

  window.StatusCodes = {
    'Success': 200,
    'Response redirection': 300,
    'Response error': 400,
    'Server error': 500
  };
})();
