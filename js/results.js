'use strict';
//  модуль, который отображает результаты покупки Клиента
(function () {
  window.results = {
    // отобразить блоки результатов покупки
    showEmptyResults: function () {
      // если корзина пуста, то убираем соответствующие классы / скрываем блоки
      document.querySelector('.goods__cards').classList.add('goods__cards--empty');
      document.querySelector('.goods__card-empty').classList.remove('visually-hidden');

      // находим блоки в которых будет отображаться финальный заказ пользователя
      // если корзина пуста, скрываем отображение заказа
      // в шапке надпись заменяется на В корзине ничего нет
      document.querySelector('.goods__total').classList.add('visually-hidden');
      document.querySelector('.goods__order-link').classList.add('goods__order-link--disabled');
      document.querySelector('.main-header__basket').innerHTML = 'В корзине ничего нет';
    },


    // скрыть блоки результатов покупки
    hideEmptyResults: function () {
      // если корзина не пуста (если совершено нажатие, то она не пуста
      // то убираем соответствующие классы / скрываем блоки
      document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
      document.querySelector('.goods__card-empty').classList.add('visually-hidden');

      // находим блоки в которых будет отображаться финальный заказ пользователя
      // у нас их два (в шапке сайта и непосредстенно в самой корзине, после карточек заказов)
      document.querySelector('.goods__total').classList.remove('visually-hidden');
      document.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');
    },

    // вывод общей суммы покупки и кол-ва купленных товаров в блоке заказов и в шапке сайта
    writeTotalResult: function (array) {
      var purchaseQuantity = 0;
      var purchaseSum = 0;
      var purchaseWordQuantity = '';

      for (var k = 0; k < array.length; k++) {
        purchaseQuantity += array[k].amount;
        purchaseSum += array[k].amount * array[k].price;

        // падеж отличается в зависимости от того, на какой символ заканчивается число
        // смотрим остаток от деления на 10, учитывая исключения - 11, 12, 13, 14
        switch (purchaseQuantity % 10) {
          case 1:
            purchaseWordQuantity = ' товар';
            break;
          case 0:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
            purchaseWordQuantity = ' товаров';
            break;
          case 2:
          case 3:
          case 4:
            purchaseWordQuantity = ' товара';
            break;
        }

        if (purchaseQuantity >= 11 && purchaseQuantity <= 14) {
          purchaseWordQuantity = ' товаров';
        }
      }

      document.querySelector('.goods__total-count').innerHTML = 'Итого за ' + purchaseQuantity + purchaseWordQuantity + '<span class="goods__price">' + purchaseSum + ' ₽</span>';
      document.querySelector('.main-header__basket').innerHTML = 'Итого за ' + purchaseQuantity + purchaseWordQuantity + ' ' + purchaseSum + ' ₽';
    }
  };
})();
