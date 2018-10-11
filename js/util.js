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
    },

    getNoun: function (number, one, two, five) {
      var n = Math.abs(number);
      n %= 100;
      if (n >= 5 && n <= 20) {
        return five;
      }
      n %= 10;
      if (n === 1) {
        return one;
      }
      if (n >= 2 && n <= 4) {
        return two;
      }
      return five;
    },

    getMinMax: function (array) {
      var min = array[0];
      var max = array[0];

      for (var i = 0; i < array.length; i++) {
        if (array[i] < min) {
          min = array[i];
        }
        if (array[i] > max) {
          max = array[i];
        }
      }

      var result = {
        min: min,
        max: max
      };

      return result;
    }
  };
})();
