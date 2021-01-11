import Abstract from "./abstract.js";

const createTripEventsListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class TripEventsList extends Abstract {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
