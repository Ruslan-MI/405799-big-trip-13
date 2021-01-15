import Abstract from "./abstract.js";

const createEventListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class EventList extends Abstract {
  getTemplate() {
    return createEventListTemplate();
  }
}
