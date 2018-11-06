'use strict';
(function () {
  var sidebar = document.querySelector('.catalog__sidebar');
  var sidebarSubmit = sidebar.querySelector('catalog__submit');
  var sidebarCheckboxes = sidebar.querySelectorAll('.input-btn__input--checkbox');
  var range = sidebar.querySelector('.range');

  var valueToFoodType = {
    'icecream': 'Мороженое',
    'soda': 'Газировка',
    'gum': 'Жевательная резинка',
    'marmalade': 'Мармелад',
    'marshmallows': 'Зефир'
  }

  var valueToFoodProperty = {
    'sugar-free': 'sugar',
    'vegetarian': 'vegetarian',
    'gluten-free': 'gluten'
  }

  // выведем количество товаров при загрузке, соответствующее каждому фильтру
  var sidebarCheckboxes = sidebar.querySelectorAll('.input-btn__input--checkbox');

  // заведем массив input-ов относящихся к свойствам товаров
  var inputPropertyAll = [];
  for (var i = 0; i < sidebarCheckboxes.length; i++) {
    if (sidebarCheckboxes[i].name === 'food-property') {
      inputPropertyAll = inputPropertyAll.concat(sidebarCheckboxes[i]);
    }
  }
  /*console.log('inputPropertyAll = ');
  console.log(inputPropertyAll);*/


  // ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ---------------------------------------
  // Напротив каждого из фильтров в блоке
  // input-btn__item-count должно быть показано количество товаров, подходящих
  // под выбранные фильтры. Это количество должно быть посчитано сразу после
  // получения данных и отрисовано в соответствующие блоки.
  // ------------------------------------------------------------

  var resetRange = function (data, inStock, minPrice, maxPrice) {
    // изначально выставляем полный ценовой диапазон по выгрузке
    // ползунки располагаем в крайних значениях диапазона
    // чтобы дать возможность пользователю ознакомиться с полным ассортиметом
    // без применения фильтров
    sidebar.querySelector('.range__btn--left').style.left = 0 + '%';
    sidebar.querySelector('.range__btn--right').style.left = 100 + '%';

    sidebar.querySelector('.range__fill-line').style.left = 0 + '%';
    sidebar.querySelector('.range__fill-line').style.right = 0 + '%';

    // соответственно исходное значение по фильтру равно количеству элементов в выгрузке
    sidebar.querySelector('.range__count').innerHTML = '(' + data.length + ')';

    // меняем значение цен на минимальное и максимальное
    sidebar.querySelector('.range__price--min').textContent = minPrice;
    sidebar.querySelector('.range__price--max').textContent = maxPrice;

    for (var i = 0; i < sidebarCheckboxes.length; i++) {
      if (sidebarCheckboxes[i].name === 'food-type') {
        //console.log(sidebarCheckboxes[i].name);
        var kind = sidebarCheckboxes[i].value;
        var array = data.filter(function(data) {
          return data.kind === valueToFoodType[kind];
        });
        var currentSpan = sidebarCheckboxes[i].parentNode.lastElementChild;
        currentSpan.textContent = '(' + array.length + ')';
      }

      if (sidebarCheckboxes[i].name === 'food-property') {
        var property = valueToFoodProperty[sidebarCheckboxes[i].value];
        //console.log(property);
        var array = data.filter(function(data) {
          if (property === 'vegetarian') {
            return data.nutritionFacts[property] == true;
          } else {
            return data.nutritionFacts[property] == false;
          }
        });

        var currentSpan = sidebarCheckboxes[i].parentNode.lastElementChild;
        currentSpan.textContent = '(' + array.length + ')';
      }

      // при загрузке избранного не существует
      if (sidebarCheckboxes[i].value === 'favorite') {
        var currentSpan = sidebarCheckboxes[i].parentNode.lastElementChild;
        currentSpan.textContent = '(0)';
      }

      // товары в наличии
      if (sidebarCheckboxes[i].value === 'availability') {
        var currentSpan = sidebarCheckboxes[i].parentNode.lastElementChild;
        currentSpan.textContent = '(' + inStock.length + ')';;
      }

      //console.log(sidebarCheckboxes[i].parentNode.lastElementChild);
    }
  }

  // заведем переменную userChange в которую будем заносить текущее состояние фильтра
  var userFilter;
  var arrayType = [];
  var arrayPrice = [];
  var arrayProperty = [];
  //var typeList = [];
  // ввожу объект flagList, который является индикатором работы фильтров
  // false (по умолчанию) означает что фильтр не активен
  // флаг true - что фильтр активен, есть выбранные элементы

  /*var flagList = {
    type: false,
    property: false,
    price: false
  };*/

  // ценовой диапазон по умолчанию равен ценовому диапазону по входящему массиву
  /*var minPrice = window.data.minPrice;
  var maxPrice = window.data.maxPrice;
  console.log(minPrice + ' / ' + maxPrice);*/

  var rangeCard = function (data) {
    // создаю клон массива карточек, чтобы фильтры производить на нем.
    var cloneCards = data.map(function (data) {
      return data;
    });

    // фильтр предшествующий текущему
    var prevFilter = [];

    // ценовой диапазон по умолчанию равен ценовому диапазону по входящему массиву
    // ищем минимальную/максимальную цену
    var startMinMax = window.util.getMinMax(data);
    var minPrice = startMinMax.min;
    var maxPrice = startMinMax.max;

    // var propArray = [];
    // propArray['sugar'] = [];
    // propArray['gluten'] = [];
    // propArray['vegetarian'] = [];


    var propArray = {
      0: [],
      1: [],
      2: []
    };


    console.log(minPrice + ' / ' + maxPrice);

    sidebar.addEventListener("click", function(evt) {
      // по умолчанию клик по label провоцирует клик по input
      // т.о получается эффект "двойного клика"
      // отменяем действие по умолчанию при клике на label
      if (evt.target.classList[0] === 'input-btn__label') {
      //if (evt.target.classList[0] === 'input-btn__input') {
        evt.preventDefault();
      }

      console.log('CLICK!');

      if (evt.target.classList.contains('input-btn__label--checkbox')) {
        console.log('Цель - label чекбокс');

        // переключение атрибута checked у checkboxa
        // if (evt.target.hasAttribute('checked')) {
        //   evt.target.removeAttribute('checked');
        // } else {
        //   evt.target.setAttribute('checked', 'checked');
        // };

        // переключение атрибута checked у checkboxa
        var curInput = evt.target.previousElementSibling;
        console.log(curInput);

        //currentInput.toggleAttribute('checked');
        if (curInput.hasAttribute('checked')) {
          curInput.removeAttribute('checked');
        } else {
          curInput.setAttribute('checked', 'checked');
        };



        /*---------------------------------------------------------------*/
        //var filterFoodType = function (kind) {
        //console.log(userChange);

        //var kind = evt.target.value;
        var kind = curInput.value;
        var currentId = '#filter-' + kind;

        //var name = evt.target.name;
        var name = curInput.name;
        //console.log(name);

        var input = sidebar.querySelector(currentId);
        //console.log(input);

        if (name === 'food-type') {
          console.log('food-type');

          var array = cloneCards.filter(function(cloneCards) {
            return cloneCards.kind === valueToFoodType[kind];
          });

          //console.log('--array');
          //console.log(array);
          //userFilter = array;

          if (input.hasAttribute('checked')) {
            // console.log(iceCream);
            arrayType = arrayType.concat(array);
            // console.log(userFilter);
            // window.data.updateList(userFilter);
            // console.log('Пополняем лиcт');
          } else {
            // если атрибута checked нет, то это значит что все карточки с типом уже находятся в выборке.
            // найдем с какой позиции в выборке пользователя начинается текущий массив
            for (var i = 0; i < userFilter.length; i++) {
              if (arrayType[i].name === array[0].name) {
                var position = i; // позиция с которой начнется удаление
                console.log('position = ' + position);
              }
            }
            arrayType.splice(position, array.length);
            //console.log('Удаляем из лиcта');
          };
        };

        if (name === 'food-property') {
          var property = valueToFoodProperty[kind];

          // мне пришлось создать массив инпутов относящихся к свойствам товара
          // с помощью него я смогу перемещаться поассоциативному массиву
          var j = inputPropertyAll.indexOf(input);
          console.log(j);

          var array = cloneCards.filter(function(cloneCards) {
            if (property === 'vegetarian') {
              return cloneCards.nutritionFacts[property] === true;
            } else {
              return cloneCards.nutritionFacts[property] === false;
            }
          });

          if (propArray[j].length == 0) {
            propArray[j] = array;
          } else {
            propArray[j] = [];
          }

          // arrayCompare содержит результат фильтрации блока свойств товара
          // мне необходимо показывать пересечение множеств масивов - без глютена, без сахара и вегетарианские
          // т.к. изначально неизвестно какой из этих фильтров является активным существует несколько вариантов:
          // 1 - все неактивны, 2 - один активен, 3 - два активно, 4 - более двух активно
          // в случае 1 и 2 сравнение не проводится
          // для случаев 3, 4 ввожу массив пересечения resultArr

          var resultArr = propArray[0];

          // flagCompare = 0 - все фильтры property неактивны,
          // = 1 - активен один фильтр
          // = 2 - активно два фильтра и т.д.
          var flagCompare = 0;

          // индекс первого непустого массива, в случае если существует
          // другой непустой массив они будут сравниваться между собой
          var indexFirst = 0;

          for (var i = 0; i < inputPropertyAll.length; i++) {
            if (resultArr.length === 0) {
              resultArr = propArray[i + 1];
              indexFirst = i + 1;
            }

            if (propArray[i].length > 0) {
              flagCompare += 1;
            }

            if (flagCompare === 1) {
              arrayProperty = resultArr;
            }

            if (flagCompare > 1) {
              var arrayA = resultArr;

              var indexSecond = indexFirst + 1;
              if (propArray[indexSecond].length === 0) {
                indexSecond += 1;
              }

              var arrayB = propArray[indexSecond];

              var arrayCompare = window.util.arrayIntersect(arrayA, arrayB);

              console.log('--------------------------arrayA');
              console.log(arrayA);
              console.log('--------------------------arrayB');
              console.log(arrayB);
              console.log('--------------------------arrayCompare');
              console.log(arrayCompare);
              arrayProperty = arrayCompare;
            }

            if (flagCompare > 2) {
              indexSecond += 1;
              if (propArray[indexSecond].length === 0) {
                indexSecond += 1;
              }

              arrayA = arrayCompare;
              arrayB = propArray[indexSecond];

              var arrayCompare = window.util.arrayIntersect(arrayA, arrayB);
              arrayProperty = arrayCompare;
            }
          }

          // console.log('flagCompare = ' + flagCompare);
          // console.log('--------------------------arrayCompare');
          // console.log(arrayCompare);
          // console.log('resultArr------------------------------------------------');
          // console.log(resultArr);
          // console.log('propArray-------------------------------------------------');
          // console.log(propArray);
        };
      }

      /*----------------------------------------------------------------------*/
      /*---------- ценовой фильтр ---------*/
      var priceRange = function(array, minPrice, maxPrice) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
          if ((array[i].price <= maxPrice) && (array[i].price >= minPrice)) {
            newArray.push(array[i]);
          }
        }
        return newArray;
      };

      range.addEventListener('mouseup', function () {
        console.log('Цель - ценовой фильтр');
        var arrayPrice;
        var minPrice;
        var maxPrice;
        if (userFilter.length === 0) {
          array = cloneCards;
          minPrice = window.data.minPrice;
          maxPrice = window.data.maxPrice;

          //userFilter = array;
        } else {
          var array = userFilter;

          // ищем минимальную/максимальную цену
          //var result = window.util.getMinMax(userFilter);
          minPrice = document.querySelector('.range__price--min').textContent;
          maxPrice = document.querySelector('.range__price--max').textContent;
        }

        //console.log(userFilter);
        console.log(userFilter);
        arrayPriceTotal = priceRange(array, minPrice, maxPrice);
        //console.log(userChange);
        console.log('arrayPrice = ');
        console.log(arrayPrice);
        //window.data.updateList(arrayPrice);
        //console.log(data);
        /*var array = userChange;
        if (userChange.length === 0) {
          array = cloneCards;
        }
        console.log('array::');
        console.log(array);
        userChange = priceRange(array);
        console.log();*/
      });
      /*----------------------------------------------------------------------*/

      //userFilter = arrayType;
      userFilter = arrayProperty;
      //userFilter = arrayPrice;

      console.log('userFilterActive = ');
      console.log(userFilter);



      // каждый раз перед выведением фильтра проверяем пуста ли категория избранное
      // если избанное не пусто, делаем активным значок избранного
      if (window.render.favorite.length !== 0) {
        console.log('Я сюда зашла1');
      }

      // пр нажатии на кнопку показать все фильтр сбрасывается
      // ценовой фильтр тоже сбрасывается, показывается полный диапазон - сделать, это еще не реализовано

      if (evt.target.classList.contains('catalog__submit')) {
        //alert('xnjkhjgk');
        evt.preventDefault();
        //console.log(2);
        window.data.updateList(data);
        /* при сбросе фильтра обнуляем массивы по каждому типу фильтра*/
        arrayType = [];

        arrayProperty = [];
        arrayCompare = [];
        resultArr = [];
        arrayA = [];
        arrayB = [];
        var flagCompare = 0;
        var indexFirst = 0;
        indexSecond = 0;

        arrayPrice = [];

        userFilter = [];
        console.log('userFilterNull = ');
        console.log(userFilter);
        //userFilter = data;
        //console.log(userFilter);

        for (var i = 0; i < sidebarCheckboxes.length; i++) {
          if (sidebarCheckboxes[i].hasAttribute('checked')) {
            sidebarCheckboxes[i].removeAttribute('checked');
          }
        }
      }

      // каждый раз при изменении формы мы перерисовываем отфильтрованые карточки
      // если фильтр пуст, то выводятся все карточки
      if (userFilter.length !== 0) {
        window.data.updateList(userFilter);
      } else {
        window.data.updateList(data);
      }

      // каждый раз при изменении формы меняем диапазон ценового фильтра
      // если текущий фильтр отличен от предыдущего, менем диапазон ценового фильтра
      if (userFilter.length !== prevFilter.length) {
        console.log('Фильтр не совпадает с предыдщущим!');

        if (userFilter.length !== 0) {
          var resultMinMax = window.util.getMinMax(userFilter);
          //console.log(resultMinMax);

          window.data.minPrice = resultMinMax.min;
          window.data.maxPrice = resultMinMax.max;

          // кол-во карточек по текущему фильтру
          sidebar.querySelector('.range__count').innerHTML = '(' + userFilter.length + ')';
        } else {
          var resultMinMax = window.util.getMinMax(cloneCards);
          //console.log(resultMinMax);

          window.data.minPrice = resultMinMax.min;
          window.data.maxPrice = resultMinMax.max;

          // кол-во карточек по текущему фильтру
          sidebar.querySelector('.range__count').innerHTML = '(' + cloneCards.length + ')';
        }

        sidebar.querySelector('.range__btn--left').style.left = 0 + '%';
        sidebar.querySelector('.range__btn--right').style.left = 100 + '%';

        sidebar.querySelector('.range__fill-line').style.left = 0 + '%';
        sidebar.querySelector('.range__fill-line').style.right = 0 + '%';

        // меняем значение цен на минимальное и максимальное по текущему фильтру
        sidebar.querySelector('.range__price--min').textContent = resultMinMax.min;
        sidebar.querySelector('.range__price--max').textContent = resultMinMax.max;

      }

      prevFilter = userFilter.map(function (userFilter) {
        return userFilter;
      });

      //window.data.updateList(userFilter);

    });
  }

  window.filter = {
    rangeCard: rangeCard,
    resetRange: resetRange
  }
})();
