'use strict';
// общие методы
(function () {
  window.util = {
    // возвращает произвольный элемент
    getRandomElement: function (array) {
      var randomElement = array[Math.floor(Math.random() * array.length)];
      return randomElement;
    },

    // возвращает произвольный элемент из интервала
    getRandomFromInterval: function (min, max) {
      var randomFromInterval = Math.floor(Math.random() * (max - min + 1) + min);
      return randomFromInterval;
    },

    // перемешивает элементы массива в произвольном порядке
    getShuffleArray: function (arrayName) {
      var array = arrayName.slice(0);
      var j;
      var temp;
      for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }
      return array;
    }
  };
})();
