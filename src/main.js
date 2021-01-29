import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
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

const tripHeaderPresenter = new TripHeaderPresenter(tripMain, tripFiltersHeading, filterModel, eventsModel);
const tripPresenter = new TripPresenter(tripEvents, eventsModel, filterModel, apiNetwork);

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

  tripPresenter.addNewEvent();
};

filterModel.setType(UpdateType.MAJOR, defaultFilter);

eventAddButton.addEventListener(`click`, eventAddClickHandler);

tripPresenter.init();

apiNetwork.getAllData()
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
