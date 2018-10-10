'use strict';

(function () {
  var SEND_URL = 'https://js.dump.academy/candyshop';
  var LOAD_URL = 'https://js.dump.academy/candyshop/data';

  window.backend = {
    // backend.load должна получать с сервера данные с помощью объекта XMLHttpRequest
    // или с помощью JSONP, обрабатывать полученные запросы и передавать
    // полученную информацию в функцию обратного вызова;
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s

      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    // backend.save должна отправлять данные на сервер, обрабатывать ошибки
    // и скрывать форму редактирования персонажа, если ошибок не произошло;
    send: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad();
        } else {
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s

      xhr.open('POST', SEND_URL);
      xhr.send(data);
    }
  };
})();
