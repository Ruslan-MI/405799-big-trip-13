import {
  createTripInfoTemplate
} from "./view/trip-info.js";
import {
  createTripTabsTemplate
} from "./view/trip-tabs.js";
import {
  createTripFiltersTemplate
} from "./view/trip-filters.js";
import {
  createTripSortTemplate
} from "./view/trip-sort.js";
import {
  createTripEventsListTemplate
} from "./view/trip-events-list.js";
import {
  createEventEditTemplate
} from "./view/event-edit.js";
import {
  createTripEventsItemTemplate
} from "./view/trip-events-item.js";
import {
  getMockRoutePoint
} from "./mock/routePoint.js";

const ITEMS_COUNT = 3;
const ROUTE_POINT_COUNT = 20;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

const mockRoutePoints = new Array(ROUTE_POINT_COUNT).fill().map(getMockRoutePoint);

const mockRouteCities = Array.from(new Set(mockRoutePoints.map((point) => {
  return point.city;
})));

const mockRouteCost = mockRoutePoints.map((point) => {
  return point.price;
}).reduce((a, b) => {
  return a + b;
});

const renderTemplate = (targetTag, template, place) => {
  targetTag.insertAdjacentHTML(place, template);
};

renderTemplate(tripMain, createTripInfoTemplate(mockRouteCities, mockRouteCost), `afterbegin`);
renderTemplate(tripTabsHeading, createTripTabsTemplate(), `afterend`);
renderTemplate(tripFiltersHeading, createTripFiltersTemplate(), `afterend`);
renderTemplate(tripEvents, createTripSortTemplate(), `beforeend`);
renderTemplate(tripEvents, createTripEventsListTemplate(), `beforeend`);

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

renderTemplate(tripEventsList, createEventEditTemplate(mockRoutePoints[0]), `beforeend`);

for (let i = 0; i < ITEMS_COUNT; i++) {
  renderTemplate(tripEventsList, createTripEventsItemTemplate(mockRoutePoints[i]), `beforeend`);
}
