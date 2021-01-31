import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import TripHeaderPresenter from "./presenter/trip-header.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {
  RenderPosition,
  TripTab,
  FilterType,
  UpdateType
} from "./const.js";
import {
  render,
  remove
} from "./utils/dom-actions.js";
import {
  isOnline,
  removeOfflineTransparent,
  showOfflineTransparent
} from "./utils/common.js";
import {
  toast
} from "./utils/toast/toast.js";

const AUTHORIZATION = `Basic 64nz2ik5a7razfa`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);
const tripEvents = pageMain.querySelector(`.trip-events`);
const eventAddButton = tripMain.querySelector(`.trip-main__event-add-btn`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const defaultTripTab = TripTab.TABLE;
let currentTripTab = defaultTripTab;
const defaultFilter = FilterType.EVERYTHING;

let tripTabsComponent = null;
let statisticsComponent = null;

const filterModel = new FilterModel();
const eventsModel = new EventsModel();

const tripHeaderPresenter = new TripHeaderPresenter(tripMain, tripFiltersHeading, filterModel, eventsModel);
const tripPresenter = new TripPresenter(tripEvents, eventsModel, filterModel, apiWithProvider);

const resetTripTabs = () => {
  remove(tripTabsComponent);

  tripTabsComponent = new TripTabsView(currentTripTab);

  render(tripTabsHeading, tripTabsComponent, RenderPosition.AFTEREND);

  tripTabsComponent.setClickHandler(handleTripTabsClick);
};

const handleTripTabsClick = (tripTab) => {
  currentTripTab = tripTab;
  resetTripTabs();

  switch (tripTab) {
    case TripTab.TABLE:
      remove(statisticsComponent);
      tripPresenter.init();
      break;
    case TripTab.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getData());
      render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const eventAddClickHandler = () => {
  filterModel.setType(UpdateType.MAJOR, defaultFilter);

  if (currentTripTab !== TripTab.TABLE) {
    handleTripTabsClick(TripTab.TABLE);
  }

  if (!isOnline()) {
    toast(`You can't create new event offline`);

    return;
  }

  tripPresenter.addNewEvent();
};

filterModel.setType(UpdateType.MAJOR, defaultFilter);

eventAddButton.addEventListener(`click`, eventAddClickHandler);

tripPresenter.init();

apiWithProvider.getAllData()
  .then((events) => {
    eventsModel.setData(UpdateType.INIT, events);
    resetTripTabs();
    tripHeaderPresenter.init();
  })
  .catch(() => {
    eventsModel.setData(UpdateType.INIT, []);
    resetTripTabs();
    tripHeaderPresenter.init();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  removeOfflineTransparent();
  if (apiWithProvider.getIsSyncNeeded()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  showOfflineTransparent(tripMain);
});
