import Observer from "../utils/observer.js";

export default class Filter extends Observer {
  constructor() {
    super();

    this._currentFilterType = null;
  }

  setFilter(updateType, filter) {
    this._currentFilterType = filter;

    this._notify(updateType, filter);
  }

  getFilter() {
    return this._currentFilterType;
  }
}
