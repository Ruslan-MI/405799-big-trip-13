import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._data = [];
  }

  setData(updateType, events) {
    this._data = events.slice();

    this._notify(updateType);
  }

  getData() {
    return this._data;
  }

  updateData(updateType, update) {
    const index = this._data.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._data = [
      ...this._data.slice(0, index),
      update,
      ...this._data.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addData(updateType, update) {
    this._data = [
      update,
      ...this._data
    ];

    this._notify(updateType, update);
  }

  deleteData(updateType, update) {
    const index = this._data.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._data = [
      ...this._data.slice(0, index),
      ...this._data.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign({}, event, {
      price: event.base_price,
      startTime: new Date(event.date_from),
      endTime: new Date(event.date_to),
      isFavorite: event.is_favorite
    });

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign({}, event, {
      "base_price": event.price,
      "date_from": event.startTime.toISOString(),
      "date_to": event.endTime.toISOString(),
      "is_favorite": event.isFavorite
    });

    delete adaptedEvent.price;
    delete adaptedEvent.startTime;
    delete adaptedEvent.endTime;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
