'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 300;
  var PRICE_RANGE_POINTS = {
    'low': 10000,
    'middle': 10000 - 50000,
    'high': 50000
  };
  var userFilter = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'housing-features': []
  };

  var lastTimeout;
  var debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };

  var updatePins = function () {
    var popup = document.querySelector('article.popup');
    if (popup) {
      window.map.section.removeChild(popup);
    }
    var filteredArray = window.load.hosts.slice();
    filteredArray.forEach(function (element) {
      if (element.offer.price < PRICE_RANGE_POINTS.low) {
        element.priceRange = 'low';
      } else if (element.offer.price > PRICE_RANGE_POINTS.high) {
        element.priceRange = 'high';
      } else {
        element.priceRange = 'middle';
      }
    });
    var arrayCompare = function (firstArray, secondArray) {
      var comparedElements = [];
      firstArray.forEach(function (element1) {
        var sameElements = secondArray.filter(function (element2) {
          return element1 === element2;
        });
        if (sameElements.length !== 0) {
          comparedElements.push(sameElements);
        }
      });
      return (comparedElements.length === firstArray.length) ? true : false;
    };


    filteredArray = filteredArray.filter(function (element) {
      return ((element.offer.type === userFilter['housing-type']) || (userFilter['housing-type'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((element.offer.rooms === parseFloat(userFilter['housing-rooms'])) || (userFilter['housing-rooms'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((element.offer.guests === parseFloat(userFilter['housing-guests'])) || (userFilter['housing-guests'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((element.priceRange === userFilter['housing-price']) || (userFilter['housing-price'] === 'any'));
    });
    filteredArray = filteredArray.filter(function (element) {
      return ((userFilter['housing-features'].length === 0) || (arrayCompare(userFilter['housing-features'], element.offer.features)));
    });
    var filteredPinsQuantity = (filteredArray.length > window.map.PIN_QUANTITY) ? window.map.PIN_QUANTITY : filteredArray.length;
    window.pins.drawing(filteredArray, filteredPinsQuantity);
    window.cards.popupAppear(filteredArray);
  };

  window.map.filtersForm.addEventListener('change', function (evt) {
    if (evt.target.name === 'features') {
      var isFeatureSet = userFilter['housing-features'].indexOf(evt.target.value);
      if (isFeatureSet === -1) {
        userFilter['housing-features'].push(evt.target.value);
      } else {
        userFilter['housing-features'].splice(isFeatureSet, 1);
      }
    } else {
      userFilter[evt.target.name] = evt.target.value;
    }
    debounce(updatePins);
  });
})();
