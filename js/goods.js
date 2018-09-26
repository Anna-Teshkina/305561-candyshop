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
    var cardItem = getCard();
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

var getCard = function () {
  var card = {
    name: getRandomElement(CARD_NAMES),
    picture: 'img/cards/' + getRandomElement(PIC_NAMES),
    amount: getRandomFromInterval(0, 20),
    price: getRandomFromInterval(100, 1500),
    weight: getRandomFromInterval(30, 300),
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
document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');


/* Шаблон для карточки товара */
var cardList = document.querySelector('.catalog__cards');
var cardElementTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

var renderCard = function (card, i) {
  var cardElement = cardElementTemplate.cloneNode(true);

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

  cardElement.querySelector('.card__btn').id = i;

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

var renderFragmentElem = function (method, elem) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(method(elem, i));
  return fragment;
};

// вывод товаров на главной
cardList.appendChild(renderFragment(cards.length, renderCard, cards));

// Шаблон для товара, добавленного в корзину
// var orders = getCardsArray(ORDER_COUNT);

var orderList = document.querySelector('.goods__cards');
var orderElementTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

var renderOrder = function (card) {
  var orderElement = orderElementTemplate.cloneNode(true);

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
  orderElement.querySelector('.card-order__count').id = card.id;

  return orderElement;
};

// вывод товаров, добавленных пользователем в корзину
// orderList.appendChild(renderFragment(orders.length, renderOrder, orders)); ???

document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
document.querySelector('.goods__card-empty').classList.add('visually-hidden');

// добавление выбранного товара в избранное
var btnFavorite = document.querySelector('.card__btn-favorite');
btnFavorite.addEventListener('click', function () {
  btnFavorite.classList.toggle('card__btn-favorite--selected');
});

// добавление выбранного товара в корзину
// --создаем массив всех кнопок Добавить +1
var btnCardAll = document.querySelectorAll('.card__btn');

// --создаем пустой массив orders
var orders = [];
for (var i = 0; i < btnCardAll.length; i++) {

  btnCardAll[i].addEventListener('click', function () {
    orderList.innerHTML = '';
    // console.log( cards[this.closest('.catalog__card').id] );
    var btnId = this.id;
    // console.log('btnId = ' + btnId);

    // console.log(cards[btnId]);

    // console.log(this.closest('.card'));

    if (cards[btnId].amount > 0) {
      cards[btnId].amount -= 1;

      if (cards[btnId].amount === 0) {
        this.closest('.card').classList.add('card--soon');
        this.closest('.card').classList.remove('card--little');
        this.closest('.card').classList.remove('card--in-stock');
      }

      if ((cards[btnId].amount >= 1) && (cards[btnId].amount <= 5)) {
        this.closest('.card').classList.remove('card--soon');
        this.closest('.card').classList.add('card--little');
        this.closest('.card').classList.remove('card--in-stock');
      }

      if (cards[btnId].amount > 5) {
        this.closest('.card').classList.remove('card--soon');
        this.closest('.card').classList.remove('card--little');
        this.closest('.card').classList.add('card--in-stock');
      }

      // console.log('amount = ' + cards[btnId].amount);

      var findCard = Object.assign({}, cards[btnId]);
      // console.log(findCard);

      var currentOrder = getOrder(findCard, btnId);
      var flag = 0;

      if (orders.length === 0) {
        currentOrder.amount = 1;
        orders.push(currentOrder);
        // console.log('Первый элемент');
      } else {
        for (var j = 0; j < orders.length; j++) {
          if (currentOrder.name === orders[j].name) {
            flag = 1;
            var index = j;
          }
        }

        if (flag > 0) {
          orders[index].amount += 1;
        } else {
          currentOrder.amount = 1;
          orders.push(currentOrder);
        }

        // console.log('flagSum = ' + flagSum);
      }
    }

    for (j = 0; j < orders.length; j++) {
      orderList.appendChild(renderFragmentElem(renderOrder, orders[j]));
    }


    // мы можем управлять заказами, если корзина не пуста
    if (orders.length !== 0) {
      // --создаем массив всех кнопок Увеличить кол-во
      var btnIncreaseAll = document.querySelectorAll('.card-order__btn--increase');
      // console.log('btnIncreaseAll = ');
      // console.log(btnIncreaseAll);

      // --создаем массив всех кнопок Уменьшить кол-во
      // var btnDecreaseAll = document.querySelectorAll('.card-order__btn--decrease');

      // --создаем массив всех кнопок Удалить позицию из корзины
      // var btnDecreaseAll = document.querySelectorAll('.card-order__close');


      for (var k = 0; k < btnIncreaseAll.length; k++) {
        // при нажатии на кнопку увеличить кол-во товара
        btnIncreaseAll[k].addEventListener('click', function () {

          // console.log(1);
          orderList.innerHTML = '';

          var inputID = this.closest('.card-order').querySelector('.card-order__count').id;
          // console.log('inputID = ' + inputID);

          var p = inputID.split('-');
          // console.log(p);

          var cardID = p[0];

          if (cards[cardID].amount > 0) {
            cards[cardID].amount -= 1;
            // console.log('amount!! = ' + cards[cardID].amount);

            orders[cardID].amount += 1;
            // console.log(orders[cardID]);
          }

          for (j = 0; j < orders.length; j++) {
            orderList.appendChild(renderFragmentElem(renderOrder, orders[j]));
          }
        });

      }
    }

  });
}

var getOrder = function (card, id) {
  var order = {
    name: card.name,
    picture: card.picture,
    price: card.price,
    amount: 0,
    id: id + '-count'
  };
  return order;
};


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
