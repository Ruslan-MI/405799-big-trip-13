import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripBoardPresenter from "./presenter/trip-board.js";
import TripHeaderPresenter from "./presenter/trip-header.js";
import ApiNetwork from "./api.js";
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

const AUTHORIZATION = `Basic 64nz2ik5a7razfa`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);
const tripEvents = pageMain.querySelector(`.trip-events`);
const eventAddButton = tripMain.querySelector(`.trip-main__event-add-btn`);

const apiNetwork = new ApiNetwork(END_POINT, AUTHORIZATION);

const defaultTripTab = TripTab.TABLE;
let currentTripTab = defaultTripTab;
const defaultFilter = FilterType.EVERYTHING;

let tripTabsComponent = null;
let statisticsComponent = null;

const filterModel = new FilterModel();
const eventsModel = new EventsModel();

filterModel.setFilter(null, defaultFilter);

const tripHeaderPresenter = new TripHeaderPresenter(tripMain, tripFiltersHeading, filterModel, eventsModel);
const tripBoardPresenter = new TripBoardPresenter(tripEvents, eventsModel, filterModel, apiNetwork);

const resetTripTabs = () => {
  remove(tripTabsComponent);

  tripTabsComponent = new TripTabsView(currentTripTab);

  render(tripTabsHeading, tripTabsComponent, RenderPosition.AFTEREND);

  tripTabsComponent.setTripTabsClickHandler(showCurrentScreen);
};

const showCurrentScreen = (tripTab) => {
  currentTripTab = tripTab;
  resetTripTabs();

  switch (tripTab) {
    case TripTab.TABLE:
      remove(statisticsComponent);
      tripBoardPresenter.init();
      break;
    case TripTab.STATS:
      tripBoardPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const eventAddClickHandler = () => {
  if (currentTripTab !== TripTab.TABLE) {
    currentTripTab = TripTab.TABLE;
    remove(statisticsComponent);
    tripBoardPresenter.init();
  }

  resetTripTabs();
  tripBoardPresenter.addEvent();
};

eventAddButton.addEventListener(`click`, eventAddClickHandler);

tripBoardPresenter.init();

apiNetwork.getAllData()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    resetTripTabs();
    tripHeaderPresenter.init();
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    resetTripTabs();
    tripHeaderPresenter.init();
  });
