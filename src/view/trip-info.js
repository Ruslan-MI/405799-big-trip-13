import AbstractView from "./abstract.js";
import {
  reducer
} from "../utils/common.js";

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

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._eventCities = this._getEventCities(events);
    this._eventCost = this._getEventCost(events);
  }

  getTemplate() {
    return createTripInfoTemplate(this._eventCities, this._eventCost);
  }

  _getEventCities(events) {
    return Array.from(new Set(events.map((event) => {
      return event.city;
    })));
  }

  _getEventCost(events) {
    return events.map((event) => {
      return [event.price, ...event.offers.map((offer) => offer.price)].reduce(reducer);
    }).reduce(reducer);
  }
}
