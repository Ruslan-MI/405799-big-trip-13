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

    this._currentTripTab = currentTripTab;

    this._tripTabsClickHandler = this._tripTabsClickHandler.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate(this._currentTripTab);
  }

  setTripTabsClickHandler(callback) {
    this._callback.tripTabsClick = callback;

    this.getElement().addEventListener(`click`, this._tripTabsClickHandler);
  }

  _tripTabsClickHandler(evt) {
    if (evt.target.matches(`.trip-tabs__btn:not(.trip-tabs__btn--active)`)) {
      evt.preventDefault();

      this._callback.tripTabsClick(evt.target.dataset.tripTab);
    }
  }
}
