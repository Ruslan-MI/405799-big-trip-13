import EventsModel from "../model/events.js";
import StaticStore from "../static-store.js";
import {
  isOnline
} from "../utils/common.js";

const getSyncedEvents = (items) => {
  return items.filter(({
    success
  }) => success)
    .map(({
      payload
    }) => payload.event);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;

    this._isSyncNeeded = false;

  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer));
          this._store.setItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._isSyncNeeded = true;

    this._store.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    this._isSyncNeeded = true;

    return Promise.reject(new Error(`Add event failed`));
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    this._isSyncNeeded = true;

    return Promise.reject(new Error(`Delete event failed`));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    return [];
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers();
    }

    return [];
  }

  getAllData() {
    return Promise.all([
      this.getEvents(),
      this.getDestinations(),
      this.getOffers()
    ])
      .then(([events, destinations, offers]) => {
        StaticStore.setDestinations(destinations);
        StaticStore.setOffers(offers);

        return events;
      });
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created.map((item) => item.payload.point));
          const updatedEvents = getSyncedEvents(response.updated.map((item) => item.payload.point));
          const deletedEvents = getSyncedEvents(response.deleted.map((item) => item.payload.point));

          const items = createStoreStructure([...createdEvents, ...updatedEvents, ...deletedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getIsSyncNeeded() {
    return this._isSyncNeeded;
  }
}
