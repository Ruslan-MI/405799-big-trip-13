import AbstractView from "./abstract.js";
import {
  getEventCost,
  getEventCities,
  getTripDatesRange
} from "../utils/common.js";

const createTripInfoTemplate = (events) => {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getEventCities(events)}</h1>

    <p class="trip-info__dates">${getTripDatesRange(events)}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getEventCost(events)}</span>
  </p>
</section>`;
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
