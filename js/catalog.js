'use strict';
//  модуль, который работает с карточками товаров и корзиной
(function () {
  // установка классов на текущую карточку каталога в зависимости от кол-ва
  var setQuantityClass = function (card, cardAmount) {
    if (cardAmount === 0) {
      card.classList.add('card--soon');
      card.classList.remove('card--little');
      card.classList.remove('card--in-stock');
    }

    if ((cardAmount >= 1) && (cardAmount <= 5)) {
      card.classList.remove('card--soon');
      card.classList.add('card--little');
      card.classList.remove('card--in-stock');
    }

    if (cardAmount > 5) {
      card.classList.remove('card--soon');
      card.classList.remove('card--little');
      card.classList.add('card--in-stock');
    }
  };

  // определим порядковый номер (индекс) объекта order (который соответствует нашей дом-ноде) в массиве orders
  var findOrderIndex = function (x, array) {
    for (var k = 0; k < array.length; k++) {
      if (x.querySelector('.card-order__title').textContent === array[k].name) {
        var ind = k;
      }
    }
    return ind;
  };

  // определим есть ли товар, который мы хотим добавить, в корзине
  var findOrderInCart = function (x, array) {
    var flag = 0;
    var index = 0;
    for (var j = 0; j < array.length; j++) {
      if (x.name === array[j].name) {
        flag = 1;
        index = j;
      }
    }
    var result = {
      index: index,
      flag: flag
    };
    return result;
  };

  var deleteOrder = function (cardsArray, ordersArray, id, ev, orderL) {
    var index = findOrderIndex(ev, window.render.orders);
    if (ordersArray.length === 1) {
      // ordersArray = [];
      ordersArray.splice(0, 1);
      var v = parseInt(ev.querySelector('.card-order__count').value, 10);
      cardsArray[id].amount += v;
      orderL.removeChild(ev);
      window.results.showEmptyResults();
      window.validation.setDisabledForm(window.validation.formInputsList, window.validation.formBtnsList); // блокируем форму заказа
    } else {
      ordersArray.splice(index, 1); // удаляем из заказов текущий объект
      cardsArray[id].amount += parseInt(ev.querySelector('.card-order__count').value, 10);
      orderL.removeChild(ev);
      window.results.writeTotalResult(ordersArray);
    }
  };

  var decreaseInCart = function (ordersArray, ev, orderL) {
    var index = findOrderIndex(ev, window.render.orders);
    // console.log(ordersArray);
    if (ordersArray[index].amount > 1) {
      ordersArray[index].amount -= 1;
      ev.querySelector('.card-order__count').value = ordersArray[index].amount;
      window.results.writeTotalResult(ordersArray);
      // console.log('больше 1 единицы товара');
      // console.log(ordersArray);
    } else {
      if (ordersArray.length === 1) {
        // console.log('В корзине 1 позиция');
        /* ordersArray = [];*/
        ordersArray.splice(0, 1);
        orderL.removeChild(ev);
        window.results.showEmptyResults();
        // console.log(ordersArray);
        window.validation.setDisabledForm(window.validation.formInputsList, window.validation.formBtnsList); // блокируем форму заказа
      } else {
        ordersArray.splice(index, 1);
        orderL.removeChild(ev);
        window.results.writeTotalResult(ordersArray);
        // console.log('В корзине несколько позиций');
        // console.log(ordersArray);
      }
    }
  };

  var increaseInCart = function (ordersArray, ev) {
    var index = findOrderIndex(ev, window.render.orders); // определим порядковый номер (индекс) объекта order (который соответствует нашей дом-ноде) в массиве ordersArray
    ordersArray[index].amount += 1;
    ev.querySelector('.card-order__count').value = ordersArray[index].amount;
    window.results.writeTotalResult(ordersArray);
  };

  var addInCart = function (ordersArray, curOrder, flag, x) {
    if (ordersArray.length === 0) {
      curOrder.amount += 1;
      ordersArray.push(curOrder);
      window.render.orderList.appendChild(window.render.renderOrder(curOrder));
      window.validation.setActiveForm(window.validation.formInputsList, window.validation.formBtnsList); // активируем форму для отправки
    } else {
      var currentResult = findOrderInCart(curOrder, ordersArray);
      flag = currentResult.flag;
      // console.log('flag = ' + flag);
      var index = currentResult.index;
      if (flag > 0) {
        var findOrder = window.render.orderList.querySelector('.card-order' + x);
        // console.log(findOrder);
        window.render.orders[index].amount += 1;
        findOrder.querySelector('.card-order__count').value = window.render.orders[index].amount;
      } else {
        curOrder.amount += 1;
        ordersArray.push(curOrder);
        window.render.orderList.appendChild(window.render.renderOrder(curOrder));
      }
    }
    window.results.hideEmptyResults();
    window.results.writeTotalResult(ordersArray);
  };

  window.catalog = {
    setGoodsInCart: function (e, type) {
      var btnId = e.dataset.id;
      var q = '[data-id="' + btnId + '"]'; // вспомогательная переменная для поиска покупки с заданным data-id
      var flag = 0; // 0 - текущего товара нет в корзине, 1 - есть в корзине
      var findCard = window.render.cardList.querySelector('.card' + q);

      if (type === 'add') {
        // console.log('add--');
        findCard = Object.assign({}, window.data.cards[btnId]); // копируем карточку в findCard
        var currentOrder = window.render.getOrder(findCard, btnId);
      }

      if (window.data.cards[btnId].amount > 0) {
        if ((type === 'add') || (type === 'increase')) {
          window.data.cards[btnId].amount -= 1; // уменьшаем на 1 кол-во товара в карточке каталога
        }

        if (type === 'add') {
          setQuantityClass(e, window.data.cards[btnId].amount); // меняем класс текущей карточки каталога
          addInCart(window.render.orders, currentOrder, flag, q); // добавляем товар в корзину
        }
        if (type === 'increase') {
          increaseInCart(window.render.orders, e);
          setQuantityClass(findCard, window.data.cards[btnId].amount);
        }
      }

      if (type === 'decrease') {
        window.data.cards[btnId].amount += 1;
      }

      if (type === 'decrease') {
        decreaseInCart(window.render.orders, e, window.render.orderList);
        setQuantityClass(findCard, window.data.cards[btnId].amount); // меняем класс текущей карточки каталога
      }

      if (type === 'delete') {
        deleteOrder(window.data.cards, window.render.orders, btnId, e, window.render.orderList);
        setQuantityClass(findCard, window.data.cards[btnId].amount);
      }
    }
  };
})();
