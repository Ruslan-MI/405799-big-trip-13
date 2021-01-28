import AbstractView from "./abstract.js";

const createLoadingMessageTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class LoadingMessage extends AbstractView {
  getTemplate() {
    return createLoadingMessageTemplate();
  }
}
