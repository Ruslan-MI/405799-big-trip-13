import AbstractView from "./abstract.js";
import {
  FilterType
} from "../const.js";
import {
  getFilterDisable
} from "../utils/common.js";

const createFilterItemTemplates = (filterType, events) => {
  return Object.values(FilterType).map((type) => {
    return `<div class="trip-filters__filter">
  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
  ${type === filterType ? `checked` : ``} ${getFilterDisable(events, type)}>
  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
</div>`;
  }).join(``);
};

const createTripFiltersTemplate = (filterType, events) => {
  return `<form class="trip-filters" action="#" method="get">
  ${createFilterItemTemplates(filterType, events)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
};

export default class TripFilters extends AbstractView {
  constructor(filterType, events) {
    super();

    this._filterType = filterType;
    this._events = events;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filterType, this._events);
  }

  setTypeChangeHandler(callback) {
    this._callback.typeChange = callback;
    this.getElement().addEventListener(`change`, this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    this._callback.typeChange(evt.target.value);
  }
}
