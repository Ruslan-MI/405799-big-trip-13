import dayjs from "dayjs";
import he from "he";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import SmartView from "./smart.js";
import {
  EVENT_TYPES
} from "../const.js";
import {
  getCheckedType,
  getCheckedOffer,
  getCityNames,
  getIdForTitle,
  getAvailableOffers,
  getRequiredUpdate
} from "../utils/common.js";

const createEventTypeItemTemplates = (data) => {
  return EVENT_TYPES.map((type) => {
    return `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type}" ${getCheckedType(data, type)}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
  }).join(``);
};

const createEventSectionOffersTemplate = (data, availableOffers) => {
  const isAvailableOffers = Boolean(availableOffers.length > 0);

  if (isAvailableOffers) {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createEventOfferSelectorTemplates(data, availableOffers)}
    </div>
  </section>`;
  }

  return ``;
};

const createEventOfferSelectorTemplates = (data, availableOffers) => {
  return availableOffers.map((offer) => {
    return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getIdForTitle(offer.title)}-1" type="checkbox"
    name="event-offer-${getIdForTitle(offer.title)}" ${getCheckedOffer(data, offer)} data-offer-title="${offer.title}">
  <label class="event__offer-label" for="event-offer-${getIdForTitle(offer.title)}-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;
  }).join(``);
};

const createEventSectionDestinationTemplate = (data, cityExpositions) => {
  const cityExposition = cityExpositions.find((city) => city.name === data.city);
  const description = cityExposition.description;
  const isDescription = Boolean(description);
  const photos = cityExposition.photos;
  const isPhotos = Boolean(photos.length > 0);
  const isDestinationSection = Boolean(description || photos.length > 0);

  if (isDestinationSection) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${isDescription ? `<p class="event__destination-description">${description}</p>` : ``}

    ${isPhotos ? `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createEventPhotoTemplates(photos)}
    </div>
  </div>` : ``}

  </section>`;
  }
  return ``;
};

const createEventPhotoTemplates = (photos) => {
  return photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`;
  }).join(``);
};

const createDatalistOptionTemplates = (cityExpositions) => {
  return getCityNames(cityExpositions).map((name) => {
    return `<option value="${name}"></option>`;
  }).join(``);
};

const createEventEditTemplate = (data, availableOffers, cityExpositions) => {
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
          name="event-destination" value="${he.encode(data.city)}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDatalistOptionTemplates(cityExpositions)}
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
    ${createEventSectionOffersTemplate(data, availableOffers)}
    ${createEventSectionDestinationTemplate(data, cityExpositions)}
    </section>
  </form>
</li>`;
};

export default class EventEdit extends SmartView {
  constructor(event, allOffers, cityExpositions) {
    super();
    this._event = event;
    this._data = event;
    this._allOffers = allOffers;
    this._availableOffers = getAvailableOffers(this._allOffers, this._data.type);
    this._cityExpositions = cityExpositions;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._eventSaveButton = this.getElement().querySelector(`.event__save-btn`);

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
    this._offersToggleHandler = this._offersToggleHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);
    this._editDeleteHandler = this._editDeleteHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventEditTemplate(this._data, this._availableOffers, this._cityExpositions);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  setEditSubmitHandler(callback) {
    this._callback.editSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._editSubmitHandler);
  }

  setEditDeleteHandler(callback) {
    this._callback.editDelete = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._editDeleteHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setEditSubmitHandler(this._callback.editSubmit);
    this.setEditDeleteHandler(this._callback.editDelete);
  }

  reset(event) {
    this.updateData(event, true);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  _setInnerHandlers() {
    if (this.getElement().querySelector(`.event__available-offers`)) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`click`, this._offersToggleHandler);
    }

    this._setStartDatepicker();
    this._setEndDatepicker();
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
  }

  _cityChangeHandler(evt) {
    if (!getCityNames(this._cityExpositions).includes(evt.target.value)) {
      this._eventSaveButton.disabled = true;
      return;
    }

    this._eventSaveButton.disabled = false;

    this.updateData({
      city: evt.target.value
    }, true);
  }

  _offersToggleHandler(evt) {
    if (evt.target.matches(`.event__offer-checkbox`)) {
      this.updateData({
        offers: [...this.getElement().querySelectorAll(`.event__offer-checkbox:checked`)].map((checkbox) =>
          this._availableOffers.find((offer) => {
            return offer.title === checkbox.dataset.offerTitle;
          }))
      });
    }
  }

  _typeChangeHandler(evt) {
    this._availableOffers = getAvailableOffers(this._allOffers, evt.target.value);

    this.updateData({
      type: evt.target.value,
      offers: []
    }, true);
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`), {
      dateFormat: `d/m/y H:i`,
      defaultDate: this._data.startTime,
      onChange: this._startTimeChangeHandler
    });
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(this.getElement().querySelector(`#event-end-time-1`), {
      dateFormat: `d/m/y H:i`,
      defaultDate: this._data.endTime,
      onChange: this._endTimeChangeHandler
    });
  }

  _startTimeChangeHandler([date]) {
    const newStartTime = dayjs(date).toDate();
    const update = {};

    if (this._data.endTime < newStartTime) {
      update.endTime = newStartTime;
    }

    update.startTime = newStartTime;

    this.updateData(update, true);
  }

  _endTimeChangeHandler([date]) {
    const newEndTime = dayjs(date).toDate();
    const update = {};

    if (this._data.startTime > newEndTime) {
      update.startTime = newEndTime;
    }

    update.endTime = newEndTime;

    this.updateData(update, true);
  }

  _priceChangeHandler(evt) {
    if (!evt.target.value.match(/^\d+$/)) {
      this._eventSaveButton.disabled = true;
      return;
    }

    this._eventSaveButton.disabled = false;

    this.updateData({
      price: Number(evt.target.value)
    });
  }

  _rollupClickHandler() {
    this._callback.rollupClick();
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();

    const requiredUpdate = getRequiredUpdate(this._data, this._event);

    if (requiredUpdate) {
      this._callback.editSubmit(requiredUpdate, this._data);
      return;
    }

    this._callback.rollupClick();
  }

  _editDeleteHandler(evt) {
    evt.preventDefault();

    this._callback.editDelete(this._data);
  }
}
