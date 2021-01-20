import dayjs from "dayjs";
import flatpickr from "flatpickr";
import {
  eventTypes,
  offerTypes,
  cityDescriptions,
  offersClassMap
} from "../mock/routePoint.js";
import {
  getCheckedType,
  getCheckedOffer,
  getCityNames
} from "../utils/common.js";
import Smart from "./smart.js";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEventTypeItemTemplates = (data) => {
  return eventTypes.map((type) => {
    return `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type}" ${getCheckedType(data, type)}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
  }).join(``);
};

const createEventSectionOffersTemplate = (data) => {
  if (data.isAvailableOffers) {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createEventOfferSelectorTemplates(data)}
    </div>
  </section>`;
  }

  return ``;
};

const createEventOfferSelectorTemplates = (data) => {
  return data.availableOffers.map((offer) => {
    return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offersClassMap[offer.title]}-1" type="checkbox"
    name="event-offer-${offersClassMap[offer.title]}" ${getCheckedOffer(data, offer)} data-offer-title="${offer.title}">
  <label class="event__offer-label" for="event-offer-${offersClassMap[offer.title]}-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;
  }).join(``);
};

const createEventSectionDestinationTemplate = (data) => {
  if (data.isDestinationSection) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${data.isDescription ? `<p class="event__destination-description">${data.description}</p>` : ``}

    ${data.isPhotos ? `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createEventPhotoTemplates(data)}
    </div>
  </div>` : ``}

  </section>`;
  }
  return ``;
};

const createEventPhotoTemplates = (data) => {
  return data.photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`;
  }).join(``);
};

const createDatalistOptionTemplates = () => {
  return getCityNames(cityDescriptions).map((name) => {
    return `<option value="${name}"></option>`;
  }).join(``);
};

const createEventEditTemplate = (data) => {
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type}.png" alt="Event type icon">
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
          ${createDatalistOptionTemplates()}
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

      <button class="event__save-btn  btn  btn--blue" type="submit" ${data.isSubmitDisabled ? `disabled` : ``}>Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
    ${createEventSectionOffersTemplate(data)}
    ${createEventSectionDestinationTemplate(data)}
    </section>
  </form>
</li>`;
};

export default class EventEdit extends Smart {
  constructor(routePoint) {
    super();
    this._data = EventEdit.parseRoutePointToData(routePoint);
    this._datepicker = null;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
    this._offersToggleHandler = this._offersToggleHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  static parseRoutePointToData(routePoint) {
    const offerType = offerTypes.find((offersItem) => offersItem.type === routePoint.type);
    const availableOffers = offerType ? offerType.offers : [];
    const cityDescription = cityDescriptions.find((city) => city.name === routePoint.city);
    const description = cityDescription.description;
    const photos = cityDescription.photos;

    return Object.assign({}, routePoint, {
      availableOffers,
      isAvailableOffers: Boolean(availableOffers.length > 0),
      description,
      isDescription: Boolean(description),
      photos,
      isPhotos: Boolean(photos.length > 0),
      isDestinationSection: Boolean(description || photos.length > 0),
      isSubmitDisabled: Boolean(routePoint.startTime >= routePoint.endTime)
    });
  }

  static parseDataToRoutePoint(data) {
    data = Object.assign({}, data);

    delete data.availableOffers;
    delete data.isAvailableOffers;
    delete data.description;
    delete data.isDescription;
    delete data.photos;
    delete data.isPhotos;
    delete data.isDestinationSection;
    delete data.isSubmitDisabled;

    return data;
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  setEditSubmitHandler(callback) {
    this._callback.editSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._editSubmitHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setEditSubmitHandler(this._callback.editSubmit);
  }

  reset(routePoint) {
    this.updateData(EventEdit.parseRoutePointToData(routePoint), true);
  }

  _setInnerHandlers() {
    if (this._data.isAvailableOffers) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`click`, this._offersToggleHandler);
    }

    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
  }

  _cityChangeHandler(evt) {
    this.updateData({
      city: evt.target.value
    });

    this.updateData(EventEdit.parseRoutePointToData(this._data), true);
  }

  _offersToggleHandler(evt) {
    if (evt.target.matches(`.event__offer-checkbox`)) {
      this.updateData({
        offers: [...this.getElement().querySelectorAll(`.event__offer-checkbox:checked`)].map((checkbox) =>
          this._data.availableOffers.find((offer) => {
            return offer.title === checkbox.dataset.offerTitle;
          }))
      });
    }
  }

  _typeChangeHandler(evt) {
    this.updateData({
      type: evt.target.value,
      offers: []
    });

    this.updateData(EventEdit.parseRoutePointToData(this._data), true);
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    this._datepicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`), {
      dateFormat: `d/m/y H:i`,
      defaultDate: this._data.startTime,
      onChange: this._startTimeChangeHandler
    });

    this._datepicker = flatpickr(this.getElement().querySelector(`#event-end-time-1`), {
      dateFormat: `d/m/y H:i`,
      defaultDate: this._data.endTime,
      onChange: this._endTimeChangeHandler
    });
  }

  _startTimeChangeHandler([date]) {
    this.updateData({
      startTime: dayjs(date).toDate()
    });
    this.updateData(EventEdit.parseRoutePointToData(this._data), true);
  }

  _endTimeChangeHandler([date]) {
    this.updateData({
      endTime: dayjs(date).toDate()
    });
    this.updateData(EventEdit.parseRoutePointToData(this._data), true);
  }

  _priceChangeHandler(evt) {
    this.updateData({
      price: evt.target.value
    });
  }

  _rollupClickHandler() {
    this._callback.rollupClick();
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.editSubmit(EventEdit.parseDataToRoutePoint(this._data));
  }
}
