import AbstractView from "./abstract.js";

const createEmptyListMessageTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EmptyListMessage extends AbstractView {
  getTemplate() {
    return createEmptyListMessageTemplate();
  }
}
