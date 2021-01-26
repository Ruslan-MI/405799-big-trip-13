import EventsModel from "./model/events.js";
import StoreModel from "./model/store.js";
import FilterModel from "./model/filter.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripBoardPresenter from "./presenter/trip-board.js";
import TripHeaderPresenter from "./presenter/trip-header.js";
import {
  RenderPosition,
  TripTab
} from "./const.js";
import {
  render,
  remove
} from "./utils/dom-actions.js";
import {
  getMockEvent,
  getAllOffers,
  getCityExpositions
} from "./mock/event.js";

const MOCK_EVENTS_COUNT = 5;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);
const tripEvents = pageMain.querySelector(`.trip-events`);
const eventAddButton = tripMain.querySelector(`.trip-main__event-add-btn`);

const events = new Array(MOCK_EVENTS_COUNT).fill().map(getMockEvent);
const offers = getAllOffers();
const cityExpositions = getCityExpositions();

const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new StoreModel();
const cityExpositionsModel = new StoreModel();

eventsModel.setEvents(events);
offersModel.setData(offers);
cityExpositionsModel.setData(cityExpositions);

let tripTabsComponent = null;
let statisticsComponent = null;

const defaultTripTab = TripTab.TABLE;
let currentTripTab = defaultTripTab;

const resetTripTabs = () => {
  remove(tripTabsComponent);

  tripTabsComponent = new TripTabsView(currentTripTab);

  render(tripTabsHeading, tripTabsComponent, RenderPosition.AFTEREND);

  tripTabsComponent.setTripTabsClickHandler(showCurrentScreen);
};

const showCurrentScreen = (tripTab) => {
  currentTripTab = tripTab;

  switch (tripTab) {
    case TripTab.TABLE:
      resetTripTabs();
      remove(statisticsComponent);
      tripBoardPresenter.init();
      break;
    case TripTab.STATS:
      resetTripTabs();
      tripBoardPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const handleEventAddClick = () => {
  if (currentTripTab !== TripTab.TABLE) {
    currentTripTab = TripTab.TABLE;
    remove(statisticsComponent);
    tripBoardPresenter.init();
  }

  resetTripTabs();
};

const tripHeaderPresenter = new TripHeaderPresenter(tripMain, tripFiltersHeading, filterModel, eventsModel);
const tripBoardPresenter = new TripBoardPresenter(tripEvents, eventsModel, offersModel, cityExpositionsModel, filterModel, eventAddButton, handleEventAddClick);

resetTripTabs();

tripHeaderPresenter.init();
showCurrentScreen(currentTripTab);
