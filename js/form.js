'use strict';
(function () {
  var TYPE_MIN_PRICE = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };
  var dropVariants = ['dragenter', 'dragover', 'dragleave'];
  var main = document.querySelector('main');
  var adTitle = window.map.adForm.querySelector('#title');
  var adPrice = window.map.adForm.querySelector('#price');
  var adType = window.map.adForm.querySelector('#type');
  var adAvatar = window.map.adForm.querySelector('#avatar');
  var adAvatarPic = window.map.adForm.querySelector('.ad-form-header__preview > img');
  var checkedType = window.map.adForm.querySelector('#type>option:checked');
  var adCheckIn = window.map.adForm.querySelector('#timein');
  var adCheckOut = window.map.adForm.querySelector('#timeout');
  var adRoomNumber = window.map.adForm.querySelector('#room_number');
  var adCapacity = window.map.adForm.querySelector('#capacity');
  var adPhoto = window.map.adForm.querySelector('#images');
  var adPhotoPic = window.map.adForm.querySelector('.ad-form__photo');
  var adAvatarDropZone = window.map.adForm.querySelector('.ad-form-header__drop-zone');
  var adPhotosDropZone = window.map.adForm.querySelector('.ad-form__drop-zone');
  var checkedRoomNumber = window.map.adForm.querySelector('#room_number>option:checked').value;
  var resetButton = window.map.adForm.querySelector('button[type=reset]');

  var successMessage = document.querySelector('#success').content.querySelector('div');
  var errorMessage = document.querySelector('#error').content.querySelector('div');

  var selectReset = function (nodeList) {
    Array.prototype.forEach.call(nodeList.children, function (element) {
      element.selected = '';
      element.disabled = '';
    });
  };

  var checkInOutTimeSet = function (input, evt) {
    selectReset(input);
    var checkedTime = parseFloat(evt.target.value);
    Array.prototype.forEach.call(input.children, function (element) {
      element.selected = (parseFloat(element.value) === checkedTime) ? 'selected' : '';
    });
  };
  var setPrice = function () {
    checkedType = window.map.adForm.querySelector('#type>option:checked');
    adPrice.min = TYPE_MIN_PRICE[checkedType.value];
    adPrice.placeholder = TYPE_MIN_PRICE[checkedType.value];
  };

  var setAvailibleCapacity = function () {
    var checkedRoomIndex = checkedRoomNumber % 10;
    Array.prototype.forEach.call(adCapacity.children, function (element) {
      element.selected = '';
      element.disabled = 'disabled';
      if (+element.value === checkedRoomIndex || element.value < checkedRoomIndex && element.value > 0) {
        element.disabled = '';
        element.selected = 'selected';
      }
    });
  };

  var setPreviewImage = function (input, imgBox) {
    var picContainer = imgBox.parentElement;
    var fReader = new FileReader();
    var newBox = imgBox.cloneNode(true);
    fReader.readAsDataURL(input.files[0]);
    fReader.onload = function (event) {
      if (imgBox.tagName === 'IMG') {
        imgBox.src = event.target.result;
      } else {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(newBox);
        var newPic = document.createElement('img');
        newBox.appendChild(newPic);
        newPic.width = 70;
        newPic.height = 70;
        newPic.src = event.target.result;
        picContainer.insertBefore(fragment, picContainer.children[1]);
      }
    };
  };

  var onEscCloseSuccessMessage = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      main.removeChild(successMessage);
      document.removeEventListener('keydown', onEscCloseSuccessMessage);
    }
  };
  var onClickCloseSuccessMessage = function () {
    main.removeChild(successMessage);
    successMessage.removeEventListener('click', onClickCloseSuccessMessage);
    document.removeEventListener('keydown', onEscCloseSuccessMessage);
  };

  var onEscCloseErrorMessage = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      main.removeChild(errorMessage);
      document.removeEventListener('keydown', onEscCloseErrorMessage);
    }
  };
  var onClickCloseErrorMessage = function () {
    main.removeChild(errorMessage);
    errorMessage.removeEventListener('click', onClickCloseErrorMessage);
    document.removeEventListener('keydown', onEscCloseErrorMessage);
  };


  var errorFormUpload = function () {
    main.appendChild(errorMessage);
    var errorMessageCloseButton = document.querySelector('.error__button');
    document.addEventListener('keydown', onEscCloseErrorMessage);
    errorMessageCloseButton.addEventListener('click', onClickCloseErrorMessage);
  };


  window.map.adForm.action = 'https://js.dump.academy/keksobooking';

  adTitle.required = 'required';
  adTitle.minLength = '30';
  adTitle.maxLength = '100';
  adTitle.addEventListener('input', function () {
    adTitle.style = ((adTitle.value.length > adTitle.maxLength) || (adTitle.value.length < adTitle.minLength)) ? 'outline: 5px solid red' : '';
  });

  adPrice.required = 'required';
  adPrice.type = 'number';
  adPrice.max = 1000000;

  setPrice();

  adType.addEventListener('change', function (evt) {
    checkedType = evt.target.value;
    adPrice.min = TYPE_MIN_PRICE[checkedType];
    adPrice.placeholder = TYPE_MIN_PRICE[checkedType];
  });

  adPrice.addEventListener('input', function () {
    var inputValue = parseFloat(adPrice.value);
    adPrice.style = ((inputValue < adPrice.min) || (inputValue > adPrice.max)) ? 'outline: 5px solid red' : '';
  });

  adCheckIn.addEventListener('change', function (evt) {
    checkInOutTimeSet(adCheckOut, evt);
  });

  adCheckOut.addEventListener('change', function (evt) {
    checkInOutTimeSet(adCheckIn, evt);
  });

  setAvailibleCapacity();

  adRoomNumber.addEventListener('change', function (evt) {
    checkedRoomNumber = parseInt(evt.target.value, 10);
    setAvailibleCapacity();
  });


  dropVariants.forEach(function (element) {
    adAvatarDropZone.addEventListener(element, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    });
    adPhotosDropZone.addEventListener(element, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    });
  });

  adAvatarDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var droppedImage = evt.dataTransfer;
    setPreviewImage(droppedImage, adAvatarPic);
  });

  adPhotosDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var droppedImage = evt.dataTransfer;
    setPreviewImage(droppedImage, adPhotoPic);
  });

  adAvatar.addEventListener('change', function () {
    setPreviewImage(adAvatar, adAvatarPic);
  });

  adPhoto.addEventListener('change', function () {
    setPreviewImage(adPhoto, adPhotoPic);
  });

  window.map.adForm.addEventListener('submit', function (evt) {
    window.load('POST', 'https://js.dump.academy/keksobooking', new FormData(window.map.adForm), function () {
      main.appendChild(successMessage);
      document.addEventListener('keydown', onEscCloseSuccessMessage);
      successMessage.addEventListener('click', onClickCloseSuccessMessage);
      window.map.adForm.reset();
      setAvailibleCapacity();
      setPrice();
      selectReset(adRoomNumber);
      Array.prototype.forEach.call(window.map.filtersForm.children, function (element) {
        selectReset(element);
      });
      window.map.setActiveModeOff();
      window.map.fillAdress(window.map.MAIN_PIN_START_COORDS.X, window.map.MAIN_PIN_START_COORDS.Y);
    }, errorFormUpload);
    evt.preventDefault();
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.map.adForm.reset();
    setAvailibleCapacity();
    setPrice();
    selectReset(adRoomNumber);
    selectReset(adCheckOut);
    adPrice.style = '';
    adTitle.style = '';
    window.map.setActiveModeOff();
    window.map.fillAdress(window.map.MAIN_PIN_START_COORDS.X, window.map.MAIN_PIN_START_COORDS.Y);
  });


})();
