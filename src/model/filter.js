import Observer from "../utils/observer.js";

export default class Filter extends Observer {
  constructor() {
    super();

    this._currentType = null;
  }

  setType(updateType, filter) {
    this._currentType = filter;

    this._notify(updateType, filter);
  }

  getType() {
    return this._currentType;
  }
}
