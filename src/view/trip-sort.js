import Abstract from "./abstract.js";

export const SortType = {
  DAY: `Day`,
  EVENT: `Event`,
  TIME: `Time`,
  PRICE: `Price`,
  OFFER: `Offer`
};

const disabledTypes = [`Event`, `Offer`];

const createTripSortItemTemplates = (defaultSortType) => {
  return Object.values(SortType).map((type) => {
    return `<div class="trip-sort__item  trip-sort__item--${type.toLowerCase()}">
    <input id="sort-${type.toLowerCase()}" class="trip-sort__input  visually-hidden" data-sort-type="${type}" type="radio" name="trip-sort"
      value="sort-${type.toLowerCase()}" ${type === defaultSortType ? `checked` : ``} ${disabledTypes.includes(type) ? `disabled` : ``}>
    <label class="trip-sort__btn" for="sort-${type.toLowerCase()}">${type}</label>
  </div>`;
  }).join(``);
};

const createTripSortTemplate = (defaultSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${createTripSortItemTemplates(defaultSortType)}
</form>`;
};

export default class TripSort extends Abstract {
  constructor(defaultSortType) {
    super();

    this._defaultSortType = defaultSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._defaultSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.matches(`input[type="radio"]`)) {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }
}
