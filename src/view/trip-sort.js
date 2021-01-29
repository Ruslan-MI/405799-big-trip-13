import AbstractView from "./abstract.js";
import {
  SortType
} from "../const.js";

const disabledTypes = [`Event`, `Offer`];

const createTripSortItemTemplates = (sortType) => {
  return Object.values(SortType).map((type) => {
    return `<div class="trip-sort__item  trip-sort__item--${type.toLowerCase()}">
    <input id="sort-${type.toLowerCase()}" class="trip-sort__input  visually-hidden" data-sort-type="${type}" type="radio" name="trip-sort"
      value="sort-${type.toLowerCase()}" ${type === sortType ? `checked` : ``} ${disabledTypes.includes(type) ? `disabled` : ``}>
    <label class="trip-sort__btn" for="sort-${type.toLowerCase()}">${type}</label>
  </div>`;
  }).join(``);
};

const createTripSortTemplate = (sortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${createTripSortItemTemplates(sortType)}
</form>`;
};

export default class TripSort extends AbstractView {
  constructor(sortType) {
    super();

    this._type = sortType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._type);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener(`change`, this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    if (evt.target.matches(`input[type="radio"]`)) {
      this._callback.typeChange(evt.target.dataset.sortType);
    }
  }
}
