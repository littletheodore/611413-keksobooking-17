'use strict';
(function () {
  var Icon = {
    width: 50,
    height: 70,
    halfWidth: 25,
    halfHeight: 35
  };

  var mapIcons = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var fragment = document.createDocumentFragment();

  var drawing = function (array, pinQuantity) {
    var pins = document.querySelectorAll('button.map__pin');
    if (pins) {
      pins.forEach(function (element, index) {
        if (index !== window.map.MAIN_ICON_INDEX) {
          window.pins.mapIcons.removeChild(element);
        }
      });
    }
    for (var i = 0; i < pinQuantity; i++) {
      var element = pinTemplate.cloneNode(true);
      element.style = 'left:' + (array[i].location.x - window.pins.Icon.halfWidth) + 'px; ' + 'top:' + (array[i].location.y - window.pins.Icon.halfHeight) + 'px;';
      element.children[0].src = array[i].author.avatar;
      element.children[0].alt = array[i].offer.title;
      fragment.appendChild(element);
      window.pins.mapIcons.appendChild(fragment);
    }
  };
  window.pins = {
    'mapIcons': mapIcons,
    'Icon': Icon,
    'drawing': drawing,
  };
})();
