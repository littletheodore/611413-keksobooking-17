'use strict';
(function () {
  var PIN_QUANTITY = 5;
  var MAIN_ICON_INDEX = 0;
  var MAP_FIELD = {
    width: {
      min: 20,
      max: 1100
    },
    height: {
      min: 95,
      max: 595
    },
  };
  var MAIN_PIN_START_COORDS = {
    X: 603,
    Y: 408
  };

  var section = document.querySelector('.map');
  var mainPin = section.querySelector('.map__pin--main');
  var filtersForm = section.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form>fieldset');
  var arePinsLoaded = false;

  var activeModeOff = function () {
    arePinsLoaded = false;
    adFormFieldsets.forEach(function (element) {
      element.disabled = 'disabled';
    });
    filtersForm.classList.add('map__filters--disabled');
    if (!section.classList.contains('map--faded')) {
      section.classList.add('map--faded');
    }
    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }
    var popup = document.querySelector('article.popup');
    if (popup) {
      section.removeChild(popup);
    }
    var pins = document.querySelectorAll('button.map__pin');
    pins.forEach(function (element, index) {
      if (index !== window.map.MAIN_ICON_INDEX) {
        window.pins.mapIcons.removeChild(element);
      }
    });
    mainPin.style.top = MAIN_PIN_START_COORDS.Y + 'px';
    mainPin.style.left = MAIN_PIN_START_COORDS.X + 'px';
    fillAdress(MAIN_PIN_START_COORDS.X, MAIN_PIN_START_COORDS.Y);
  };

  var activeModeOn = function () {
    if (!(arePinsLoaded)) {
      arePinsLoaded = true;
      window.load('GET', 'https:js.dump.academy/keksobooking/data', NaN, function (hosts) {
        window.load.hosts = [];
        hosts.forEach(function (element, index) {
          window.load.hosts[index] = element;
        });
        window.pins.drawing(window.load.hosts, window.map.PIN_QUANTITY);
        window.cards.popupAppear(window.load.hosts);
      });
    }
    section.classList.remove('map--faded');
    filtersForm.classList.remove('map__filters--disabled');
    adFormFieldsets.forEach(function (element) {
      element.disabled = '';
    });
    adForm.classList.remove('ad-form--disabled');

  };

  var fillAdress = function (iconX, iconY) {
    var adressInput = document.querySelector('#address');
    adressInput.value = Math.round(iconX) + ',' + Math.round(iconY);
    adressInput.readonly = 'readonly';
  };

  var startCoordinates = {};

  var onMouseDown = function (evt) {
    evt.preventDefault();

    startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var ifCorrectCoords = function (pinCoords, min, max) {
      return Math.max(min, Math.min(pinCoords, max));
    };


    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      var mainPinLeft = mainPin.offsetLeft - shift.x;
      var mainPinTop = mainPin.offsetTop - shift.y;

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPinLeft = ifCorrectCoords(mainPinLeft, MAP_FIELD.width.min, MAP_FIELD.width.max);
      mainPinTop = ifCorrectCoords(mainPinTop, MAP_FIELD.height.min, MAP_FIELD.height.max);

      mainPin.style.top = (mainPinTop) + 'px';
      mainPin.style.left = (mainPinLeft) + 'px';

      fillAdress(parseFloat(mainPinLeft), parseFloat(mainPinTop) + window.pins.Icon.halfHeight);
      mainPin.addEventListener('mouseup', onMouseUp);
    };

    var onMouseUp = function (mouseupEvt) {
      mouseupEvt.preventDefault();

      var shift = {
        x: startCoordinates.x - mouseupEvt.clientX,
        y: startCoordinates.y - mouseupEvt.clientY
      };

      var mainPinLeft = mainPin.offsetLeft - shift.x;
      var mainPinTop = mainPin.offsetTop - shift.y;


      startCoordinates = {
        x: mouseupEvt.clientX,
        y: mouseupEvt.clientY
      };

      mainPinLeft = ifCorrectCoords(mainPinLeft, MAP_FIELD.width.min, MAP_FIELD.width.max);
      mainPinTop = ifCorrectCoords(mainPinTop, MAP_FIELD.height.min, MAP_FIELD.height.max);

      mainPin.style.top = (mainPinTop) + 'px';
      mainPin.style.left = (mainPinLeft) + 'px';

      fillAdress(parseFloat(mainPinLeft), parseFloat(mainPinTop) + window.pins.Icon.halfHeight);

      activeModeOn();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.map = {
    'section': section,
    'mainPin': mainPin,
    'filtersForm': filtersForm,
    'adForm': adForm,
    'MAIN_PIN_START_COORDS': MAIN_PIN_START_COORDS,
    'MAIN_ICON_INDEX': MAIN_ICON_INDEX,
    'PIN_QUANTITY': PIN_QUANTITY,
    'activeModeOn': activeModeOn,
    'activeModeOff': activeModeOff,
    'fillAdress': fillAdress,
  };

  window.map.activeModeOff();
  window.map.mainPin.addEventListener('mousedown', onMouseDown);

})();
