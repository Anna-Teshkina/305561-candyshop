'use strict';
(function () {
  // алгоритм Луна для проверки корректности воода банковской карты
  var checkCardNumber = function (code) {
    // var code = '1834567890123456';
    // console.log('code = ' + code);
    var codeArray = code.split('');
    var summElements = 0;

    for (var i = 0; i < codeArray.length; i++) {
      if (!(i % 2)) {
        codeArray[i] *= 2;
        if (codeArray[i] >= 10) {
          codeArray[i] -= 9;
        }
      }
      summElements += parseInt(codeArray[i], 10);
    }

    // console.log('codeArray = ' + codeArray);
    // console.log('summElements = ' + summElements);
    var result = false; // изначально предполагаем, что сумма не кратна 10
    if (summElements % 10 === 0) {
      // console.log('Кратно 10');
      result = true;
    }
    return result;
  };

  // 7.3 Если в корзине нет ни одного товара, форма оформления заказа блокируется
  // с помощью добавления атрибута disabled для всех полей или для блоков fieldset,
  // которые их содержат.

  var paymentBlock = document.querySelector('.payment');
  var deliverBlock = document.querySelector('.deliver');

  var paymentsInputs = paymentBlock.querySelectorAll('.text-input__input');
  var deliveryRadioBtns = deliverBlock.querySelectorAll('.input-btn__input');
  var deliveryInputs = deliverBlock.querySelectorAll('.text-input__input');

  var formInputsList = document.querySelectorAll('.text-input__input');
  var formBtnsList = document.querySelectorAll('.input-btn__input');

  var toggleChecked = function (block) {
    var variantsAll = block.querySelectorAll('.toggle-btn__input');

    for (var i = 0; i < variantsAll.length; i++) {
      variantsAll[i].addEventListener('click', function (evt) {
        for (var j = 0; j < variantsAll.length; j++) {
          if (variantsAll[j].hasAttribute('checked')) {
            variantsAll[j].removeAttribute('checked');
          }
        }
        evt.currentTarget.setAttribute('checked', 'checked');

        // я подумала, что нужно оставить пользователю возможность
        // перемещаться по вкладкам, но при пустой корзине поля останутся заблокированными
        switch (evt.currentTarget.getAttribute('value')) {
          case 'card':
            document.querySelector('.payment__card-wrap').classList.remove('visually-hidden');
            document.querySelector('.payment__cash-wrap').classList.add('visually-hidden');
            break;
          case 'cash':
            document.querySelector('.payment__cash-wrap').classList.remove('visually-hidden');
            document.querySelector('.payment__card-wrap').classList.add('visually-hidden');
            break;
          case 'store':
            document.querySelector('.deliver__store').classList.remove('visually-hidden');
            document.querySelector('.deliver__courier').classList.add('visually-hidden');
            break;
          case 'courier':
            document.querySelector('.deliver__courier').classList.remove('visually-hidden');
            document.querySelector('.deliver__store').classList.add('visually-hidden');
            break;
        }
      });
    }
  };

  var setDisabledForm = function (inputsList, btnsList) {
    for (i = 0; i < inputsList.length; i++) {
      inputsList[i].setAttribute('disabled', 'disabled');
    }

    for (i = 0; i < btnsList.length; i++) {
      btnsList[i].setAttribute('disabled', 'disabled');
    }

    document.querySelector('.deliver__textarea').setAttribute('disabled', 'disabled');

    document.querySelector('.buy__submit-btn').setAttribute('disabled', 'disabled');

    // console.log('Поля формы заблокированы');
    toggleInfoTabActive();
  };

  var toggleInfoTabActive = function () {
    var variantsAll = document.querySelectorAll('.toggle-btn__input');

    for (var i = 0; i < variantsAll.length; i++) {
      variantsAll[i].addEventListener('click', function (evt) {
        if (window.data.orders.length !== 0) {
          switch (evt.currentTarget.getAttribute('value')) {
            case 'card':
              setBankingPayment();
              break;
            case 'cash':
              disabledBankingPayment();
              break;
            case 'store':
              setStoreDelivery();
              break;
            case 'courier':
              setCourierDelivery();
              break;
          }
        }
        return false;
      });
    }
  };

  toggleChecked(paymentBlock);
  toggleChecked(deliverBlock);
  setDisabledForm(formInputsList, formBtnsList);

  var disabledBankingPayment = function () {
    for (var i = 0; i < paymentsInputs.length; i++) {
      paymentsInputs[i].setAttribute('disabled', 'disabled');
    }
  };

  var setBankingPayment = function () {
    for (var i = 0; i < paymentsInputs.length; i++) {
      paymentsInputs[i].removeAttribute('disabled', 'disabled');
    }
  };

  var setStoreDelivery = function () {
    for (var i = 0; i < deliveryRadioBtns.length; i++) {
      deliveryRadioBtns[i].removeAttribute('disabled', 'disabled');
    }
    for (i = 0; i < deliveryInputs.length; i++) {
      deliveryInputs[i].setAttribute('disabled', 'disabled');
    }
    document.querySelector('.deliver__textarea').setAttribute('disabled', 'disabled');
    chooseMetro();
  };

  var setCourierDelivery = function () {
    for (var i = 0; i < deliveryRadioBtns.length; i++) {
      deliveryRadioBtns[i].setAttribute('disabled', 'disabled');
    }
    for (i = 0; i < deliveryInputs.length; i++) {
      deliveryInputs[i].removeAttribute('disabled', 'disabled');
    }
    document.querySelector('.deliver__textarea').removeAttribute('disabled', 'disabled');
  };

  // 9.4 При переключении станции метро, изображение карты меняется на то, которое соответствует выбранной станции.
  var chooseMetro = function () {
    var metroVariants = document.querySelectorAll('.input-btn__input');
    for (var i = 0; i < metroVariants.length; i++) {
      metroVariants[i].addEventListener('click', function (evt) {
        for (var j = 0; j < metroVariants.length; j++) {
          if (metroVariants[j].hasAttribute('checked')) {
            metroVariants[j].removeAttribute('checked');
          }
        }
        evt.currentTarget.setAttribute('checked', 'checked');
        var picName = evt.currentTarget.getAttribute('value');
        document.querySelector('.deliver__store-map-img').src = 'img/map/' + picName + '.jpg';
      });
    }
  };

  // 8.7 Рядом с номером карты отображается статус карты. Пока данные не введены
  // или не все данные корректны, отображается статус «Не определён».
  // Когда все введённые данные корректны, статус карты меняется на «Одобрен».

  for (var i = 0; i < paymentsInputs.length; i++) {
    paymentsInputs[i].addEventListener('blur', function () {
      // console.log('Фокус снят');
      checkCardDetails();
    });
  }

  var checkCardDetails = function () {
    var cardInputCheck = [];
    for (var k = 0; k < paymentsInputs.length; k++) {
      // console.log('paymentsInputs.length = ' + paymentsInputs.length);
      var t = paymentsInputs[k].name;
      // var cardInputCheck = [];

      switch (t) {
        case 'card-number':
          var cardNumber = paymentsInputs[k].value;
          // console.log('cardNumber = ' + cardNumber);
          if ((!checkCardNumber(cardNumber)) || (cardNumber === '')) {
            cardInputCheck[0] = 0;
            paymentsInputs[k].style.borderBottomColor = '#ff5722';
          } else {
            cardInputCheck[0] = 1;
            paymentsInputs[k].style.borderBottomColor = '#e8e8e8';
          }
          // console.log('luna = ' + checkCardNumber(cardNumber));
          // console.log('cardInputCheck[0] = ' + cardInputCheck[0]);
          break;
        case 'card-date':
          var cardDate = paymentsInputs[k].value;
          // console.log('cardDate = ' + cardDate);

          // if ((/[0-1]{1}[0-9]{1}\/[0-9]{2}/.test(cardDate)) && (cardDate !== '')) {
          if (!checkCardDate(cardDate)) {
            cardInputCheck[1] = 0;
            paymentsInputs[k].style.borderBottomColor = '#ff5722';
          } else {
            cardInputCheck[1] = 1;
            paymentsInputs[k].style.borderBottomColor = '#e8e8e8';
          }
          // console.log('cardDatecheck = ' + /[0-9]{2}/.test(cardDate));
          // console.log('cardInputCheck[1] = ' + cardInputCheck[1]);
          break;
        case 'card-cvc':
          var cardCvc = paymentsInputs[k].value;
          // console.log('cardCvc = ' + cardCvc);
          if ((/[1-9]{1}[0-9]{2}/.test(cardCvc)) && (cardCvc !== '') && (cardCvc < 1000) && (cardCvc > 99)) {
            cardInputCheck[2] = 1;
            paymentsInputs[k].style.borderBottomColor = '#e8e8e8';
          } else {
            cardInputCheck[2] = 0;
            paymentsInputs[k].style.borderBottomColor = '#ff5722';
          }
          // console.log('cardInputCheck[2] = ' + cardInputCheck[2]);
          break;
        case 'cardholder':
          var cardHolder = paymentsInputs[k].value;
          /* console.log('cardHolder = ' + cardHolder);*/
          if (checkHolderName(cardHolder)) {
            cardInputCheck[3] = 1;
            paymentsInputs[k].style.borderBottomColor = '#e8e8e8';
          } else {
            cardInputCheck[3] = 0;
            paymentsInputs[k].style.borderBottomColor = '#ff5722';
          }
          // console.log('cardInputCheck[3] = ' + cardInputCheck[3]);
          break;
      }
    }
    // console.log('cardInputCheck = ' + cardInputCheck);
    var status = 1;
    for (var j = 0; j < cardInputCheck.length; j++) {
      status *= cardInputCheck[j];
    }

    var cardStatusNode = document.querySelector('.payment__card-status');

    if (status === 1) {
      cardStatusNode.textContent = 'Определен';
    } else {
      cardStatusNode.textContent = 'Не определен';
    }
  };

  var checkHolderName = function (name) {
    var flag = 1;
    if (name === '') {
      flag = 0;
    }
    var nameA = name.split(' ');
    // console.log('nameA = ' + nameA);
    if (nameA.length !== 2) {
      flag = 0;
    }
    for (var j = 0; j < 2; j++) {
      if (!/[A-Z]{1,}/.test(nameA[j])) {
        flag = 0;
      }
    }
    return flag;
  };

  var checkCardDate = function (date) {
    var flag = 1;
    if (date === '') {
      flag = 0;
    }
    var dateA = date.split('/');
    // console.log('dateA = ' + dateA);
    if (dateA.length !== 2) {
      flag = 0;
    }

    var month = dateA[0];
    var year = dateA[1];

    // console.log('month = ' + month);
    // console.log('year = ' + year);

    if ((month > 12) || (!/[0-9]{2}/.test(month)) || (/[A-Za-zА-Яа-я]/.test(month))) {
      flag = 0;
    }

    if ((!/[0-9]{2}/.test(year)) || (/[A-Za-zА-Яа-я]/.test(year)) || (year > 99)) {
      flag = 0;
    }
    return flag;
  };

  window.validation = {
    formInputsList: formInputsList,
    formBtnsList: formBtnsList,
    setDisabledForm: setDisabledForm,

    setActiveForm: function (inputsList, btnsList) {
      for (i = 0; i < inputsList.length; i++) {
        inputsList[i].removeAttribute('disabled', 'disabled');
      }

      for (i = 0; i < btnsList.length; i++) {
        btnsList[i].removeAttribute('disabled', 'disabled');
      }

      document.querySelector('.buy__submit-btn').removeAttribute('disabled', 'disabled');

      // если пользователь еще не добавил никакой товар в корзину, но уже
      // поинтересовался какие данные ему нужно будет предоставить - нажимал
      // на клавиши табов, в момент активации формы (корзина не пуста), надо
      // сделать так, чтобы при активации формы активировались поля с активными табами,
      // а с неактивными - деактивировались.
      if (document.querySelector('#payment__card').hasAttribute('checked')) {
        setBankingPayment();
      }
      if (document.querySelector('#payment__cash').hasAttribute('checked')) {
        disabledBankingPayment();
      }
      if (document.querySelector('#deliver__store').hasAttribute('checked')) {
        setStoreDelivery();
      }
      if (document.querySelector('#deliver__courier').hasAttribute('checked')) {
        setCourierDelivery();
      }

      toggleInfoTabActive();
    },

  };
})();
