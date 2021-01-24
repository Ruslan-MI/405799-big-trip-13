import EventsModel from "./model/events.js";
import OthersModel from "./model/others.js";
import FilterModel from "./model/filter.js";
import TripTabsView from "./view/trip-tabs.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import {
  RenderPosition
} from "./const.js";
import {
  render
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
const tripEvents = pageMain.querySelector(`.trip-events`);
const eventAddButton = tripMain.querySelector(`.trip-main__event-add-btn`);

const events = new Array(MOCK_EVENTS_COUNT).fill().map(getMockEvent);
const offers = getAllOffers();
const cityExpositions = getCityExpositions();

const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new OthersModel();
const cityExpositionsModel = new OthersModel();

eventsModel.setEvents(events);
offersModel.setData(offers);
cityExpositionsModel.setData(cityExpositions);

render(tripTabsHeading, new TripTabsView(), RenderPosition.AFTEREND);

const filterPresenter = new FilterPresenter(tripFiltersHeading, filterModel, eventsModel);
const tripPresenter = new TripPresenter(tripMain, tripEvents, eventsModel, offersModel, cityExpositionsModel, filterModel);

filterPresenter.init();
tripPresenter.init();

eventAddButton.addEventListener(`click`, () => {
  tripPresenter.createEvent(eventAddButton);
});
