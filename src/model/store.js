export default class Store {
  constructor() {
    this._data = [];
  }

  setData(data) {
    this._data = data.slice();
  }

  getData() {
    return this._data;
  }
}
