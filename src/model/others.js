export default class Others {
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
