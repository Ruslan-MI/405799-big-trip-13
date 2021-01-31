import AbstractView from "./abstract.js";
import {
  getEventDateDatetime,
  getEventDateValue,
  getEventDuration,
  getEventTimeDatetime,
  getEventTimeValue
} from "../utils/common.js";

const OFFERS_COUNT = 2;

const createEventOfferTemplates = (offers) => {
  return offers.slice(0, OFFERS_COUNT).map((offer) => {
    return `<li class="event__offer">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</li>`;
  }).join(``);
};

const createTripEventsItemTemplate = (data) => {
  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date"
      datetime="${getEventDateDatetime(data.startTime)}">${getEventDateValue(data.startTime)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${data.type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${data.type} ${data.destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${getEventTimeDatetime(data.startTime)}">${getEventTimeValue(data.startTime)}</time>
        &mdash;
        <time class="event__end-time" datetime="${getEventTimeDatetime(data.endTime)}">${getEventTimeValue(data.endTime)}</time>
      </p>
      <p class="event__duration">${getEventDuration(data)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${data.price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
  ${createEventOfferTemplates(data.offers)}
    </ul>
    <button class="event__favorite-btn ${data.isFavorite ? `event__favorite-btn--active` : ``}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path
          d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class EventItem extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
    this._favoriteButton = this.getElement().querySelector(`.event__favorite-btn`);

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._enableFavoriteButton = this._enableFavoriteButton.bind(this);
  }

  getTemplate() {
    return createTripEventsItemTemplate(this._data);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this._favoriteButton.addEventListener(`click`, this._favoriteClickHandler);
  }

  resetForError() {
    this._shake(this._enableFavoriteButton);
  }

  _disableFavoriteButton() {
    this._favoriteButton.disabled = true;
  }

  _enableFavoriteButton() {
    this._favoriteButton.disabled = false;
  }

  _rollupClickHandler() {
    this._callback.rollupClick();
  }

  _favoriteClickHandler() {
    this._disableFavoriteButton();

    this._callback.favoriteClick();
  }
}
