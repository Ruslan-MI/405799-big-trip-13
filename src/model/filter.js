import Observer from "../utils/observer.js";
import {
  FilterType
} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();

    this._defaultFilter = FilterType.EVERYTHING;
    this._currentFilterType = this._defaultFilter;
  }

  setFilter(updateType, filter) {
    this._currentFilterType = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._currentFilterType;
  }
}
