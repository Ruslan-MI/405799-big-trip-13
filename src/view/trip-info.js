import {
  createElement
} from "../utils.js";

const createTripInfoTemplate = (cities, cost) => {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${cities.length > 3 ? cities[0] + ` &mdash;...&mdash; ` + cities[cities.length - 1] : cities.join(` &mdash; `)}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
</section>`;
};

export default class TripInfo {
  constructor(routeCities, routeCost) {
    this._element = null;
    this._routeCities = routeCities;
    this._routeCost = routeCost;
  }

  getTemplate() {
    return createTripInfoTemplate(this._routeCities, this._routeCost);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
