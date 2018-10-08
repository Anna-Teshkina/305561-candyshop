'use strict';
(function () {
  /*фильтр по цене :: реализация перемещения ползунков фильтра*/
  var rangeFilter = document.querySelector('.range__filter'); // блок фильтра

  rangeFilter.addEventListener('mousedown', function (evt) {
    if (evt.target.classList.contains('range__btn--left')) {
      changeSlideValue(evt, '.range__btn--left', 1);
      // console.log('левый');
    }
    if (evt.target.classList.contains('range__btn--right')) {
      changeSlideValue(evt, '.range__btn--right', 2);
      // console.log('правый');
    }
  });

  var changeSlideValue = function (evt, btnClass, btnNumber) {
    var parentLeftX = rangeFilter.offsetLeft; // отступ родительского элемента от края экрана слева
    var parentWidth = rangeFilter.clientWidth; // ширина родительского элемента
    var btnCenterX = rangeFilter.querySelector('.range__btn').offsetWidth / 2; // центр ползунка
    var btnSlide = rangeFilter.querySelector(btnClass);
    var clientStartX = evt.clientX; // координата X при выборе пользователем диапазона

    var leftBtn = getComputedStyle(rangeFilter.querySelector('.range__btn--left'));
    var rightBtn = getComputedStyle(rangeFilter.querySelector('.range__btn--right'));

    // стартовые координаты центров ползунков
    var leftValue = parseInt(leftBtn.left, 10) + btnCenterX;
    var rightValue = parseInt(rightBtn.left, 10) + btnCenterX;

    var activeLine = rangeFilter.querySelector('.range__fill-line'); // активная полоса
    var value = 0;

    var onMouseMove = function (moveEvt) {
      sliderCoord(moveEvt, clientStartX);
    };

    var onMouseUp = function (upEvt) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (upEvt.clientX === clientStartX) {
        sliderCoord(upEvt, clientStartX);
      }
    };

    var sliderCoord = function (e, startX) {
      var shiftX = e.clientX - startX; // смещение

      if (btnNumber === 1) {
        if (leftValue + shiftX > rightValue) {
          value = rightValue - btnCenterX;
        } else {
          value = leftValue + shiftX - btnCenterX;
        }

        if (e.clientX - parentLeftX < 0) {
          value = -btnCenterX;
        }
      }

      if (btnNumber === 2) {
        if (rightValue + shiftX < leftValue) {
          value = leftValue - btnCenterX;
        } else {
          value = rightValue + shiftX - btnCenterX;
        }

        if (e.clientX - parentLeftX > parentWidth) {
          value = parentWidth - btnCenterX;
        }
      }

      btnSlide.style.left = value + 'px';

      var percent = Math.round((value + btnCenterX) * 100 / parentWidth); // переводим в %

      if (btnNumber === 1) {
        document.querySelector('.range__price--min').textContent = percent;
        activeLine.style.left = percent + '%';
      }

      if (btnNumber === 2) {
        document.querySelector('.range__price--max').textContent = percent;
        activeLine.style.right = (100 - percent) + '%';
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
})();
