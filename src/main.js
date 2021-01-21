import {
  render,
  RenderPosition
} from "./utils/dom-actions.js";
import TripTabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import {
  getMockRoutePoint,
  getAllOffers,
  getCityExpositions
} from "./mock/routePoint.js";
import TripPresenter from "./presenter/trip.js";

const MOCK_ROUTE_POINTS_COUNT = 20;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

const routePoints = new Array(MOCK_ROUTE_POINTS_COUNT).fill().map(getMockRoutePoint);
const allOffers = getAllOffers();
const cityExpositions = getCityExpositions();

render(tripTabsHeading, new TripTabsView(), RenderPosition.AFTEREND);
render(tripFiltersHeading, new TripFiltersView(), RenderPosition.AFTEREND);

const tripPresenter = new TripPresenter(tripMain, tripEvents);

tripPresenter.init(routePoints, allOffers, cityExpositions);
