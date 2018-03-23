import $ from 'jquery';
import slick from 'slick-carousel';

import Slider from './modules/slider';

$(function() {
  console.log($);

  const demoSlider = new Slider($('#demo-slider'));
  demoSlider.init();
});
