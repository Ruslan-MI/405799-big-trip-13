import AbstractView from "./abstract.js";
import {
  TripTab
} from "../const.js";

const createTripTabsButtonTemplates = (currentTripTab) => {
  return Object.values(TripTab).map((tab) => {
    return `<a class="trip-tabs__btn  ${tab === currentTripTab ? `trip-tabs__btn--active` : ``}" href="#" data-trip-tab="${tab}">${tab}</a>`;
  }).join(``);
};

const createTripTabsTemplate = (currentTripTab) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  ${createTripTabsButtonTemplates(currentTripTab)}
</nav>`;
};

export default class TripTabs extends AbstractView {
  constructor(currentTripTab) {
    super();

    this._currentState = currentTripTab;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate(this._currentState);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    if (evt.target.matches(`.trip-tabs__btn:not(.trip-tabs__btn--active)`)) {
      this._callback.click(evt.target.dataset.tripTab);
    }
  }
}
