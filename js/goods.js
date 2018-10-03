'use strict';

var NUMBER_CARDS = 3;
var CARD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var PIC_NAMES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
var CONTENT_NAMES = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
// var ORDER_COUNT = 3; // количество товаров, добавленных в корзину

var getRandomElement = function (array) {
  var randomElement = array[Math.floor(Math.random() * array.length)];
  return randomElement;
};

var getRandomFromInterval = function (min, max) {
  var randomFromInterval = Math.floor(Math.random() * (max - min + 1) + min);
  return randomFromInterval;
};

// формирует массив карточек
var getCardsArray = function (n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    var cardItem = getCard(i);
    array.push(cardItem);
  }
  return array;
};

// перемешивает элементы массива в произольном порядке
var getShuffleArray = function (arrayName) {
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
};

// произвольно генерируем состав карточки
var getContents = function () {
  var componentsNumber = getRandomFromInterval(1, CONTENT_NAMES.length);
  var components = getShuffleArray(CONTENT_NAMES).slice(0, componentsNumber - 1).join(', ');
  return components;
};

var getCard = function (index) {
  var card = {
    name: getRandomElement(CARD_NAMES),
    picture: 'img/cards/' + getRandomElement(PIC_NAMES),
    amount: getRandomFromInterval(0, 20),
    price: getRandomFromInterval(100, 1500),
    weight: getRandomFromInterval(30, 300),
    id: index,
    rating: {
      value: getRandomFromInterval(1, 5),
      number: getRandomFromInterval(10, 900),
    },
    nutritionFacts: {
      sugar: Math.round(Math.random()),
      energy: getRandomFromInterval(70, 500),
      contents: getContents()
    }
  };

  return card;
};

var cards = getCardsArray(NUMBER_CARDS);
// console.log(cards);

document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');


/* Шаблон для карточки товара */
var cardList = document.querySelector('.catalog__cards');
var cardElementTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

var renderCard = function (card) {
  var cardElement = cardElementTemplate.cloneNode(true);
  cardElement.dataset.id = card.id;

  cardElement.querySelector('.card__title').textContent = card.name;
  cardElement.querySelector('.card__img').src = card.picture;
  cardElement.querySelector('.card__img').alt = card.name;


  // var pictureURL = card.picture;
  // обрезаем img/card/ - 10 первых символов в url изображения
  // var textStep1 = pictureURL.substr(10);
  // измеряем конечную точку для метода substr - длина строки за вычетом 4х символов (.jpg)
  // var textStop = textStep1.length - 4;
  // var inputName = textStep1.substr(0, textStop);


  // cardElement.querySelector('.card__price').innerHTML = card.price + '<span class="card__currency">₽</span><span class="card__weight">' + '/ ' + card.weight + ' Г' + '</span>';
  cardElement.querySelector('.card__price').innerHTML = card.amount;

  cardElement.classList.remove('card--in-stock');

  if (card.amount === 0) {
    cardElement.classList.add('card--soon');
  }
  if ((card.amount >= 1) && (card.amount <= 5)) {
    cardElement.classList.add('card--little');
  }
  if (card.amount > 5) {
    cardElement.classList.add('card--in-stock');
  }

  var stars = '';
  switch (card.rating.value) {
    case 1:
      stars = 'stars__rating--one';
      break;
    case 2:
      stars = 'stars__rating--two';
      break;
    case 3:
      stars = 'stars__rating--three';
      break;
    case 4:
      stars = 'stars__rating--four';
      break;
    case 5:
      stars = 'stars__rating--five';
      break;
  }

  var cardRating = cardElement.querySelector('.stars__rating');
  cardRating.classList.remove('stars__rating--five');
  cardRating.classList.add(stars);

  cardElement.querySelector('.star__count').textContent = '(' + card.rating.number + ')';

  var sugarContains = 'Не содержит сахар. ';
  if (card.nutritionFacts.sugar) {
    sugarContains = 'Содержит сахар. ';
  }

  cardElement.querySelector('.card__characteristic').textContent = sugarContains + card.nutritionFacts.energy + ' ккал';
  cardElement.querySelector('.card__composition-list').textContent = card.nutritionFacts.contents;

  cardElement.addEventListener('click', function (evt) {
    // ДОБАВИТЬ В ИЗБРАННОЕ
    if (evt.target.classList.contains('card__btn-favorite')) {
      var btnFavorite = evt.currentTarget.querySelector('.card__btn-favorite');
      btnFavorite.classList.toggle('card__btn-favorite--selected');
    }

    // СМОТРЕТЬ СОСТАВ
    if (evt.target.classList.contains('card__btn-composition')) {
      var cardComposition = evt.currentTarget.querySelector('.card__composition');
      cardComposition.classList.toggle('card__composition--hidden');
    }

    // ДОБАВИТЬ В КОРЗИНУ
    if (evt.target.classList.contains('card__btn')) {
      // var btnId = evt.currentTarget.dataset.id;

      /* if (cards[btnId].amount > 0) {
        cards[btnId].amount -= 1;
        setQuantityClass(evt.currentTarget, cards[btnId].amount); // меняем класс текущей карточки каталога
        var findCard = Object.assign({}, cards[btnId]); // копируем карточку в findCard
        var currentOrder = getOrder(findCard, btnId);

        if (orders.length === 0) {
          currentOrder.amount += 1;
          orders.push(currentOrder);
          orderList.appendChild(renderOrder(currentOrder));
        } else {
          var q = '[data-id="' + btnId + '"]'; // вспомогательная переменная для поиска покупки с заданным data-id
          var flag = 0;

          var currentResult = findOrderInCart(currentOrder, orders);
          flag = currentResult.flag;
          var index = currentResult.index;

          if (flag > 0) {
            var findOrder = orderList.querySelector('.card-order' + q);
            orders[index].amount += 1;
            findOrder.querySelector('.card-order__count').value = orders[index].amount;
          } else {
            currentOrder.amount += 1;
            orders.push(currentOrder);
            orderList.appendChild(renderOrder(currentOrder));
          }
        }

        hideEmptyResults();
        writeTotalResult(orders);
      }*/

      setGoodsInCart(evt.currentTarget, 'add');

    }
  });

  return cardElement;
};

var renderFragment = function (n, method, arrayName) {
  var array = arrayName;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < n; i++) {
    fragment.appendChild(method(array[i], i));
  }
  return fragment;
};

// вывод товаров на главной
cardList.appendChild(renderFragment(cards.length, renderCard, cards));

// Шаблон для товара, добавленного в корзину
// var orders = getCardsArray(ORDER_COUNT);
var orders = [];

var orderList = document.querySelector('.goods__cards');
var orderElementTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

var renderOrder = function (card) {
  var orderElement = orderElementTemplate.cloneNode(true);

  orderElement.dataset.id = card.id;

  orderElement.querySelector('.card-order__title').textContent = card.name;

  orderElement.querySelector('.card-order__img').src = card.picture;
  orderElement.querySelector('.card-order__img').alt = card.name;

  orderElement.querySelector('.card-order__price').textContent = card.price + ' ₽';

  var pictureURL = card.picture;
  // обрезаем img/card/ - 10 первых символов в url изображения
  var textStep1 = pictureURL.substr(10);
  // измеряем конечную точку для метода substr - длина строки за вычетом 4х символов (.jpg)
  var textStop = textStep1.length - 4;
  var inputName = textStep1.substr(0, textStop);

  orderElement.querySelector('.card-order__count').value = card.amount;
  orderElement.querySelector('.card-order__count').name = inputName;

  // orderElement.querySelector('.card-order__count').id = card.id;

  orderElement.addEventListener('click', function (evt) {
    /* var btnId = evt.currentTarget.dataset.id;
    var q = '[data-id="' + btnId + '"]';
    var findCard = cardList.querySelector('.card' + q);
    var index;*/

    // УВЕЛИЧИТЬ КОЛИЧЕСТВО------------------------------------------
    if (evt.target.classList.contains('card-order__btn--increase')) {
      /* if (cards[btnId].amount > 0) {
        cards[btnId].amount -= 1; // уменьшаем на 1 кол-во товара в карточке каталога
        setQuantityClass(findCard, cards[btnId].amount); // меняем класс текущей карточки каталога

        // определим порядковый номер (индекс) объекта order (который соответствует нашей дом-ноде) в массиве orders
        /*for (var k = 0; k < orders.length; k++) {
          if (evt.currentTarget.querySelector('.card-order__title').textContent === orders[k].name) {
            var index = k;
          }
        }*//*

        index = findOrderIndex(evt.currentTarget, orders);

        orders[index].amount += 1;
        evt.currentTarget.querySelector('.card-order__count').value = orders[index].amount;
      }
      writeTotalResult(orders);*/

      setGoodsInCart(evt.currentTarget, 'increase');
    }

    // УМЕНЬШИТЬ КОЛИЧЕСТВО------------------------------------------
    if (evt.target.classList.contains('card-order__btn--decrease')) {
      /* cards[btnId].amount += 1;
      // меняем класс текущей карточки каталога
      setQuantityClass(findCard, cards[btnId].amount);

      // определим порядковый номер (индекс) объекта order (который соответствует нашей дом-ноде) в массиве orders
      /*for (k = 0; k < orders.length; k++) {
        if (evt.currentTarget.querySelector('.card-order__title').textContent === orders[k].name) {
          indexOrder = k;
        }
      }*//*

      index = findOrderIndex(evt.currentTarget, orders);

      if (orders[index].amount > 1) {
        orders[index].amount -= 1;
        evt.currentTarget.querySelector('.card-order__count').value = orders[index].amount;
        writeTotalResult(orders);
      } else {
        if (orders.length === 1) {
          orders = [];
          orderList.removeChild(evt.currentTarget);
          showEmptyResults();
        } else {
          orders.splice(index, 1);
          orderList.removeChild(evt.currentTarget);
          writeTotalResult(orders);
        }
      }*/

      setGoodsInCart(evt.currentTarget, 'decrease');
    }

    // УДАЛИТЬ КАРТОЧКУ ТОВАРА ------------------------------
    if (evt.target.classList.contains('card-order__close')) {
      /* for (k = 0; k < orders.length; k++) {
        if (evt.currentTarget.querySelector('.card-order__title').textContent === orders[k].name) {
          indexOrder = k;
        }
      }*//*

      index = findOrderIndex(evt.currentTarget, orders);

      if (orders.length === 1) {
        orders = [];
        var v = parseInt(evt.currentTarget.querySelector('.card-order__count').value, 10);
        cards[btnId].amount += v;
        orderList.removeChild(evt.currentTarget);
        showEmptyResults();
      } else {
        orders.splice(index, 1); // удаляем из заказов текущий объект
        cards[btnId].amount += parseInt(evt.currentTarget.querySelector('.card-order__count').value, 10);
        orderList.removeChild(evt.currentTarget);
        writeTotalResult(orders);
      }
      setQuantityClass(findCard, cards[btnId].amount);*/

      setGoodsInCart(evt.currentTarget, 'delete');
    }
  });
  return orderElement;
};

// отобразить блоки результатов покупки
var showEmptyResults = function () {
  // если корзина пуста, то убираем соответствующие классы / скрываем блоки
  document.querySelector('.goods__cards').classList.add('goods__cards--empty');
  document.querySelector('.goods__card-empty').classList.remove('visually-hidden');

  // находим блоки в которых будет отображаться финальный заказ пользователя
  // если корзина пуста, скрываем отображение заказа
  // в шапке надпись заменяется на В корзине ничего нет
  document.querySelector('.goods__total').classList.add('visually-hidden');
  document.querySelector('.goods__order-link').classList.add('goods__order-link--disabled');
  document.querySelector('.main-header__basket').innerHTML = 'В корзине ничего нет';
};

// скрыть блоки результатов покупки
var hideEmptyResults = function () {
  // если корзина не пуста (если совершено нажатие, то она не пуста
  // то убираем соответствующие классы / скрываем блоки
  document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
  document.querySelector('.goods__card-empty').classList.add('visually-hidden');

  // находим блоки в которых будет отображаться финальный заказ пользователя
  // у нас их два (в шапке сайта и непосредстенно в самой корзине, после карточек заказов)
  document.querySelector('.goods__total').classList.remove('visually-hidden');
  document.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');
};

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

// вывод общей суммы покупки и кол-ва купленных товаров в блоке заказов и в шапке сайта
var writeTotalResult = function (array) {
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
};

// вывод товаров, добавленных пользователем в корзину
// orderList.appendChild(renderFragment(orders.length, renderOrder, orders)); ???

// формируем объект - заказ
var getOrder = function (card, id) {
  var order = {
    name: card.name,
    picture: card.picture,
    price: card.price,
    amount: 0,
    id: id
  };
  return order;
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

var setGoodsInCart = function (e, type) {
  var btnId = e.dataset.id;
  var q = '[data-id="' + btnId + '"]'; // вспомогательная переменная для поиска покупки с заданным data-id
  var flag = 0; // 0 - текущего товара нет в корзине, 1 - есть в корзине
  var findCard = cardList.querySelector('.card' + q);

  if (type === 'add') {
    // console.log('add--');
    findCard = Object.assign({}, cards[btnId]); // копируем карточку в findCard
    var currentOrder = getOrder(findCard, btnId);
  }

  if (cards[btnId].amount > 0) {
    if ((type === 'add') || (type === 'increase')) {
      cards[btnId].amount -= 1; // уменьшаем на 1 кол-во товара в карточке каталога
    }

    if (type === 'add') {
      setQuantityClass(e, cards[btnId].amount); // меняем класс текущей карточки каталога
      addInCart(orders, currentOrder, flag, q);
    }
    if (type === 'increase') {
      increaseInCart(orders, e);
      setQuantityClass(findCard, cards[btnId].amount);
    }
  }

  if (type === 'decrease') {
    cards[btnId].amount += 1;
  }

  if (type === 'decrease') {
    decreaseInCart(orders, e, orderList);
    setQuantityClass(findCard, cards[btnId].amount); // меняем класс текущей карточки каталога
  }

  if (type === 'delete') {
    deleteOrder(cards, orders, btnId, e, orderList);
    setQuantityClass(findCard, cards[btnId].amount);
  }
};

var deleteOrder = function (cardsArray, ordersArray, id, ev, orderL) {
  var index = findOrderIndex(ev, orders);
  if (ordersArray.length === 1) {
    // ordersArray = [];
    ordersArray.splice(0, 1);
    var v = parseInt(ev.querySelector('.card-order__count').value, 10);
    cardsArray[id].amount += v;
    orderL.removeChild(ev);
    showEmptyResults();
  } else {
    ordersArray.splice(index, 1); // удаляем из заказов текущий объект
    cardsArray[id].amount += parseInt(ev.querySelector('.card-order__count').value, 10);
    orderL.removeChild(ev);
    writeTotalResult(ordersArray);
  }
};

var decreaseInCart = function (ordersArray, ev, orderL) {
  var index = findOrderIndex(ev, orders);
  // console.log(ordersArray);
  if (ordersArray[index].amount > 1) {
    ordersArray[index].amount -= 1;
    ev.querySelector('.card-order__count').value = ordersArray[index].amount;
    writeTotalResult(ordersArray);
    // console.log('больше 1 единицы товара');
    // console.log(ordersArray);
  } else {
    if (ordersArray.length === 1) {
      // console.log('В корзине 1 позиция');
      /* ordersArray = [];*/
      ordersArray.splice(0, 1);
      orderL.removeChild(ev);
      showEmptyResults();
      // console.log(ordersArray);
    } else {
      ordersArray.splice(index, 1);
      orderL.removeChild(ev);
      writeTotalResult(ordersArray);
      // console.log('В корзине несколько позиций');
      // console.log(ordersArray);
    }
  }
};

var increaseInCart = function (ordersArray, ev) {
  var index = findOrderIndex(ev, orders); // определим порядковый номер (индекс) объекта order (который соответствует нашей дом-ноде) в массиве ordersArray
  ordersArray[index].amount += 1;
  ev.querySelector('.card-order__count').value = ordersArray[index].amount;
  writeTotalResult(ordersArray);
};

var addInCart = function (ordersArray, curOrder, flag, x) {
  if (ordersArray.length === 0) {
    curOrder.amount += 1;
    ordersArray.push(curOrder);
    orderList.appendChild(renderOrder(curOrder));
  } else {
    var currentResult = findOrderInCart(curOrder, ordersArray);
    flag = currentResult.flag;
    // console.log('flag = ' + flag);
    var index = currentResult.index;
    if (flag > 0) {
      var findOrder = orderList.querySelector('.card-order' + x);
      // console.log(findOrder);
      orders[index].amount += 1;
      findOrder.querySelector('.card-order__count').value = orders[index].amount;
    } else {
      curOrder.amount += 1;
      ordersArray.push(curOrder);
      orderList.appendChild(renderOrder(curOrder));
    }
  }
  hideEmptyResults();
  writeTotalResult(ordersArray);
};

// Первая фаза работы фильтра по цене
var rangeFilter = document.querySelector('.range__filter');

rangeFilter.addEventListener('mouseup', function (evt) {
  var per = changeSlideValue(evt, '.range__btn--left');

  if (evt.target.classList.contains('range__btn--left')) {
    document.querySelector('.range__price--min').textContent = per;
  }
  if (evt.target.classList.contains('range__btn--right')) {
    per = changeSlideValue(evt, '.range__btn--right');
    document.querySelector('.range__price--max').textContent = per;
  }
});

var changeSlideValue = function (evt, btnClass) {
  var parentLeftX = rangeFilter.offsetLeft; // отступ родительского элемента от края экрана слева
  var parentWidth = rangeFilter.clientWidth; // ширина родительского элемента
  var btnCenterX = rangeFilter.querySelector('.range__btn').offsetWidth / 2; // центр ползунка
  var btnSlide = rangeFilter.querySelector(btnClass);
  var clientX = evt.clientX; // координата X при выборе пользователем диапазона
  var value = clientX - parentLeftX - btnCenterX; // "значение" слайдера
  var percent = Math.round(value * 100 / parentWidth); // переводим в %
  btnSlide.style.left = percent + '%';
  return percent;
};

// Переключение вкладок в форме оформления заказа
document.querySelector('#deliver__store').addEventListener('click', function () {
  document.querySelector('.deliver__store').classList.remove('visually-hidden');
  document.querySelector('.deliver__courier').classList.add('visually-hidden');
});

document.querySelector('#deliver__courier').addEventListener('click', function () {
  document.querySelector('.deliver__courier').classList.remove('visually-hidden');
  document.querySelector('.deliver__store').classList.add('visually-hidden');
});

document.querySelector('#payment__card').addEventListener('click', function () {
  document.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
  document.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
});

document.querySelector('#payment__cash').addEventListener('click', function () {
  document.querySelector('.payment__cash-wrap').classList.remove('visually-hidden');
  document.querySelector('.payment__card-wrap').classList.add('visually-hidden');
});

/* алгоритм Луна
var code = '1834567890123456';
var codeArray = code.split('');
var summElements = 0;

for (var i = 0; i < codeArray.length; i++) {
  if (!(i % 2)) {
    codeArray[i] *= 2;
    if (codeArray[i] >= 10) {
      codeArray[i] -= 9;
    }
  }

  summElements += parseInt(codeArray[i]);
}

console.log('codeArray2 = ' + codeArray);
console.log('summElements = ' + summElements);

if (summElements % 10 === 0) {
  console.log('Кратно 10');
} else {
  console.log('Не кратно 10');
} */
