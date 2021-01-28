export default class StaticStore {
  constructor() {
    this._offers = [];
    this._destinations = [];
  }

  static setOffers(data) {
    this._offers = data.slice();
  }

  static setDestinations(data) {
    this._destinations = data.slice();
  }

  static getOffers() {
    return this._offers;
  }

  static getDestinations() {
    return this._destinations;
  }
}
