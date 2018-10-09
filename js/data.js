'use strict';
// формирует данные каталога
(function () {
  var NUMBER_CARDS = 3;
  var CARD_NAMES = ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'];
  var PIC_NAMES = ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'];
  var CONTENT_NAMES = ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо'];
  // var ORDER_COUNT = 3; // количество товаров, добавленных в корзину

  // формирует массив карточек
  var getCardsArray = function (n) {
    var array = [];
    for (var i = 0; i < n; i++) {
      var cardItem = getCard(i);
      array.push(cardItem);
    }
    return array;
  };

  // произвольно генерируем состав карточки
  var getContents = function () {
    var componentsNumber = window.util.getRandomFromInterval(1, CONTENT_NAMES.length);
    var components = window.util.getShuffleArray(CONTENT_NAMES).slice(0, componentsNumber - 1).join(', ');
    return components;
  };

  var getCard = function (index) {
    var card = {
      name: window.util.getRandomElement(CARD_NAMES),
      picture: 'img/cards/' + window.util.getRandomElement(PIC_NAMES),
      amount: window.util.getRandomFromInterval(0, 20),
      price: window.util.getRandomFromInterval(100, 1500),
      weight: window.util.getRandomFromInterval(30, 300),
      id: index,
      rating: {
        value: window.util.getRandomFromInterval(1, 5),
        number: window.util.getRandomFromInterval(10, 900),
      },
      nutritionFacts: {
        sugar: Math.round(Math.random()),
        energy: window.util.getRandomFromInterval(70, 500),
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
      // ДОБАВИТЬ В ИЗБРАННОЕ ---------------------------------------------------
      if (evt.target.classList.contains('card__btn-favorite')) {
        var btnFavorite = evt.currentTarget.querySelector('.card__btn-favorite');
        btnFavorite.classList.toggle('card__btn-favorite--selected');
      }

      // СМОТРЕТЬ СОСТАВ -----------------------------------------------------------
      if (evt.target.classList.contains('card__btn-composition')) {
        var cardComposition = evt.currentTarget.querySelector('.card__composition');
        cardComposition.classList.toggle('card__composition--hidden');
      }

      // ДОБАВИТЬ В КОРЗИНУ ---------------------------
      if (evt.target.classList.contains('card__btn')) {
        window.catalog.setGoodsInCart(evt.currentTarget, 'add');
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

  // вывод товаров, добавленных пользователем в корзину
  // orderList.appendChild(renderFragment(orders.length, renderOrder, orders)); ???

  window.data = {
    cards: cards,
    orders: orders,
    cardList: cardList,
    orderList: orderList,

    // формируем объект - заказ
    getOrder: function (card, id) {
      var order = {
        name: card.name,
        picture: card.picture,
        price: card.price,
        amount: 0,
        id: id
      };
      return order;
    },

    renderOrder: function (card) {
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

      orderElement.addEventListener('click', function (evt) {

        // УВЕЛИЧИТЬ КОЛИЧЕСТВО------------------------------------------
        if (evt.target.classList.contains('card-order__btn--increase')) {
          window.catalog.setGoodsInCart(evt.currentTarget, 'increase');
        }

        // УМЕНЬШИТЬ КОЛИЧЕСТВО------------------------------------------
        if (evt.target.classList.contains('card-order__btn--decrease')) {
          window.catalog.setGoodsInCart(evt.currentTarget, 'decrease');
        }

        // УДАЛИТЬ КАРТОЧКУ ТОВАРА ------------------------------
        if (evt.target.classList.contains('card-order__close')) {
          window.catalog.setGoodsInCart(evt.currentTarget, 'delete');
        }
      });
      return orderElement;
    }

  };
})();
