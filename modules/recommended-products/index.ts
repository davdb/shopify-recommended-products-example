import Swiper from 'swiper';
import { Navigation, Keyboard } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types/swiper-options';

import 'swiper/swiper-bundle.css';
import './index.scss';

function initSlider() {
  const isMobileView = window.innerWidth >= 768;
  const swiperParams: SwiperOptions = {
    modules: [Navigation, Keyboard],
    slidesPerView: 'auto',
    spaceBetween: 16,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    slidesOffsetAfter: isMobileView ? 100 : 16,
    breakpoints: {
      768: {
        spaceBetween: 24,
      },
    },
  };

  const swiper = new Swiper('.swiper', swiperParams);
}

function initCustomDOMEvents() {
  document.addEventListener('shopify:section:load', function () {
    initSlider();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initSlider();
  initCustomDOMEvents();
});
