'use strict';
// при успешной загрузке формирует данные каталога
(function () {
  var cards = [];
  var resultMinMax;

  var updateList = function(data) {
    window.render.renderCardList(data);
  }

  var onLoadSuccess = function (data) {
    console.log(data);
    //var cards = [];

    // формируем массив карточек
    for (var i = 0; i < data.length; i++) {
      var cardItem = data[i];
      cardItem.id = i;
      cards.push(cardItem);
    }

    /*var updateList = function(data) {
      window.render.renderCardList(data);
    }*/

    // загружаем полученный массив на страницу
    updateList(cards);

    // ищем минимальную/максимальную цену
    var resultMinMax = window.util.getMinMax(data);

    var minPrice = resultMinMax.min;
    var maxPrice = resultMinMax.max;

    // создаем массив товаров, находящихся в наличии
    var inStock = [];
    for (var i = 0 ; i < cards.length; i++) {
      if (cards[i].amount > 0) {
        inStock.push(cards[i]);
      }
    }
    //console.log(inStock);

    // сбрасываем настройки фильтра
    window.filter.resetRange(cards, inStock, minPrice, maxPrice);

    // подключаем обработку событий фильтра
    window.filter.rangeCard(cards);

    window.data = {
      cards: cards,
      minPrice: minPrice,
      maxPrice: maxPrice,
      inStock: inStock,
      updateList: updateList
    };
  };

  var onLoadError = function (errorMessage) {
    var node = document.createElement('p');
    node.classList.add('modal__message');

    node.textContent = errorMessage;

    var messageTitle = document.querySelector('.modal__title');
    messageTitle.insertAdjacentElement('afterend', node);

    document.querySelector('.modal--error').classList.remove('modal--hidden');
  };

  window.backend.load(onLoadSuccess, onLoadError);

  /*window.data = {
    cards: cards,
    resultMinMax: resultMinMax,
    //minPrice: minPrice,
    //maxPrice: maxPrice,

    updateList: updateList
  }*/
})();
