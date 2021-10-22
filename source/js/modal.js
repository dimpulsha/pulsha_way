'use strict';
var buyButton = document.querySelectorAll('.button--modal-buy');
var modalWindow = document.querySelector('.modal-section');
var buyFormModal = document.querySelector('.modal__buy');
var okModal = document.querySelector('.modal_ok');
// console.log(buyButton);
// console.log(modalWindow);
// console.log(buyFormModal);
// console.log(okModal);
console.log('modal load ready');

// buyButton.addEventListener('click', function (evt) {
//   console.log('click-product-button');
// });
// повесить листенер открытия модалки отправки на все кнопки

if (buyButton) {
  for (var i = 0; i < buyButton.length; i++) {
    buyButton[i].addEventListener('click', function () {
      console.log('click-buy');
    });
  }

}

// повесить листенер закрытия окна отправки на весь оверлей  (посмотреть - один или 2 листенера - учитывай, что у нас 2 окна)
// повесить листенер закрытия модалки отправки на кнопку закрытия
// кнопка отправки модалки - повесить промис для отправки - в случае успешной отправки - закрываем модалку отправки и открываем модалку - ОК
// повесить листенер закрытия модалки ОК на оверлей
// повесить листинер закрытия модалки ОК на кнопку закрытия

// modal-section--open
//modal--active
