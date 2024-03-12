import Swiper from 'swiper';
import { Navigation, Keyboard } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types/swiper-options';

import 'swiper/swiper-bundle.css';
import './index.scss';

document.addEventListener('DOMContentLoaded', function () {
    function buildSlider(){      
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
        slidesOffsetAfter: 100,
        breakpoints: {
          768: {
            spaceBetween: 24,
          },
        },
      };

      const swiper = new Swiper('.swiper', swiperParams)
    };

    buildSlider();

    document.addEventListener('shopify:section:load', function () {
      buildSlider();
    });
  });