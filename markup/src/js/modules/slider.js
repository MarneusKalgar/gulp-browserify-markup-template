export default class Slider {
  constructor($elem) {
    this.$elem = $elem;
  }

  init() {
    this.$elem.slick();
  }
}
