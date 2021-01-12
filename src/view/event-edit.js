import dayjs from "dayjs";
import {
  eventTypes,
  offersTitleMap
} from "../mock/routePoint.js";
import Abstract from "./abstract.js";

const getCheckedPoint = (dataPoint, point) => {
  if (dataPoint === point) {
    return `checked`;
  }

  return ``;
};

const createEventTypeItemTemplates = (data) => {
  return eventTypes.map((type) => {
    return `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type.toLowerCase()}" ${getCheckedPoint(data.type, type)}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
  </div>`;
  }).join(``);
};

const createEventOfferSelectorTemplate = (data) => {
  return data.offers.map((offer) => {
    return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox"
    name="event-offer-${offer.title}" ${getCheckedPoint(offer.isChecked, true)}>
  <label class="event__offer-label" for="event-offer-${offer.title}-1">
    <span class="event__offer-title">${offersTitleMap[offer.title]}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;
  }).join(``);
};

const createEventSectionDestinationTemplate = (data) => {
  if (data.description || data.photos.length > 0) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${data.description ? `<p class="event__destination-description">${data.description}</p>` : ``}

    ${data.photos.length > 0 ? `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createEventPhotoTemplate(data)}
    </div>
  </div>` : ``}

  </section>`;
  }
  return ``;
};

const createEventPhotoTemplate = (data) => {
  return data.photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`;
  }).join(``);
};

const createEventEditTemplate = (data) => {
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemTemplates(data)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${data.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text"
          name="event-destination" value="${data.city}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${dayjs(data.startTime).format(`YY/MM/DD HH:mm`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${dayjs(data.endTime).format(`YY/MM/DD HH:mm`)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createEventOfferSelectorTemplate(data)}
        </div>
      </section>

      ${createEventSectionDestinationTemplate(data)}

    </section>
  </form>
</li>`;
};

export default class EventEdit extends Abstract {
  constructor(routePoint) {
    super();
    this._routePoint = routePoint;
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
  }

  _rollupClickHandler() {
    this._callback.rollupClick();
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.editSubmit();
  }

  getTemplate() {
    return createEventEditTemplate(this._routePoint);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  setEditSubmitHandler(callback) {
    this._callback.editSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._editSubmitHandler);
  }
}
