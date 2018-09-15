'use strict';

var NUMBER_CARDS = 10;

var CARD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
var PIC_NAMES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
var CONTENT_NAMES = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];

var cards = [];

var getRandomElement = function (array) {
  var randomElement = array[Math.floor(Math.random() * array.length)];
  return randomElement;
};

var getRandomFromInterval = function (min, max) {
  var randomFromInterval = Math.floor(Math.random() * (max - min + 1) + min);
  return randomFromInterval;
};

var getContents = function () {
  var componentsArray = [];
  var components = '';
  var componentsNumber = getRandomFromInterval(1, CONTENT_NAMES.length);

  for (var i = 0; i < componentsNumber; i++) {
    var componentItem = getRandomElement(CONTENT_NAMES);

    if (componentsArray.length > 0) {
      while (componentsArray.includes(componentItem)) {
        componentItem = getRandomElement(CONTENT_NAMES);
      }
    }
    componentsArray.push(componentItem);
  }

  for (i = 0; i < componentsArray.length; i++) {
    if (i !== componentsArray.length - 1) {
      components += componentsArray[i] + ', ';
    } else {
      components += componentsArray[i];
    }
  }
  return components;
};

getContents();

var getCard = function () {
  var cardName = getRandomElement(CARD_NAMES);
  var cardUrl = 'img/cards/' + getRandomElement(PIC_NAMES);
  var bulleanRandom = Math.round(Math.random());

  var card = {
    name: cardName,
    picture: cardUrl,
    amount: getRandomFromInterval(0, 20),
    price: getRandomFromInterval(100, 1500),
    weight: getRandomFromInterval(30, 300),
    rating: {
      value: getRandomFromInterval(1, 5),
      number: getRandomFromInterval(10, 900),
    },
    nutritionFacts: {
      sugar: bulleanRandom,
      energy: getRandomFromInterval(70, 500),
      contents: getContents()
    }
  };

  return card;
};

for (var i = 0; i < NUMBER_CARDS; i++) {
  var cardItem = getCard();
  cards.push(cardItem);
}

document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');


/* Шаблон для карточки товара */
var cardList = document.querySelector('.catalog__cards');
var cardElementTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

var renderCard = function (card) {
  var cardElement = cardElementTemplate.cloneNode(true);

  cardElement.querySelector('.card__title').textContent = card.name;
  cardElement.querySelector('.card__img').src = card.picture;
  cardElement.querySelector('.card__img').alt = card.name;

  cardElement.querySelector('.card__price').innerHTML = card.price + '<span class="card__currency">₽</span><span class="card__weight">' + '/ ' + card.weight + ' Г' + '</span>';

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
  if (card.rating.value === 1) {
    stars = 'stars__rating--one';
  }
  if (card.rating.value === 2) {
    stars = 'stars__rating--two';
  }
  if (card.rating.value === 3) {
    stars = 'stars__rating--three';
  }
  if (card.rating.value === 4) {
    stars = 'stars__rating--four';
  }
  if (card.rating.value === 5) {
    stars = 'stars__rating--five';
  }

  var cardRating = cardElement.querySelector('.stars__rating');
  cardRating.classList.remove('stars__rating--five');
  cardRating.classList.add(stars);

  cardElement.querySelector('.star__count').textContent = '(' + card.rating.number + ')';

  var sugarContains = '';
  if (card.nutritionFacts.sugar) {
    sugarContains = 'Содержит сахар. ';
  } else {
    sugarContains = 'Не содержит сахар. ';
  }

  cardElement.querySelector('.card__characteristic').textContent = sugarContains + card.nutritionFacts.energy + ' ккал';
  cardElement.querySelector('.card__composition-list').textContent = card.nutritionFacts.contents;

  return cardElement;
};

var fragment = document.createDocumentFragment();

for (i = 0; i < cards.length; i++) {
  fragment.appendChild(renderCard(cards[i]));
}

cardList.appendChild(fragment);

// Шаблон для товара, добавленного в корзину
var orderCount = 3;

var orders = [];

for (i = 0; i < orderCount; i++) {
  var orderItem = getCard();
  orders.push(orderItem);
}

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
  orderElement.querySelector('.card-order__count').id = '#' + inputName;


  return orderElement;
};

var orderFragment = document.createDocumentFragment();

for (i = 0; i < orders.length; i++) {
  orderFragment.appendChild(renderOrder(orders[i]));
}

orderList.appendChild(orderFragment);

document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
document.querySelector('.goods__card-empty').classList.add('visually-hidden');
