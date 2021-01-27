export default class StaticStore {
  constructor() {
    this._offers = [];
    this._cityExpositions = [];
  }

  static setOffers(data) {
    this._offers = data.slice();
  }

  static setCityExpositions(data) {
    this._cityExpositions = data.slice();
  }

  static getOffers() {
    return this._offers;
  }

  static getCityExpositions() {
    return this._cityExpositions;
  }
}
