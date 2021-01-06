import {
  render, RenderPosition
} from "./utils.js";
import TripInfoView from "./view/trip-info.js";
import TripTabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import TripSortView from "./view/trip-sort.js";
import TripEventsListView from "./view/trip-events-list.js";
import EventEditView from "./view/event-edit.js";
import TripEventsItemView from "./view/trip-events-item.js";
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

const tripEventsListComponent = new TripEventsListView();

const renderEvents = (eventsListElement, routePoint) => {
  const itemComponent = new TripEventsItemView(routePoint);
  const editFormComponent = new EventEditView(routePoint);

  const replaceItemToEditForm = () => {
    eventsListElement.replaceChild(editFormComponent.getElement(), itemComponent.getElement());
  };

  const replaceEditFormToItem = () => {
    eventsListElement.replaceChild(itemComponent.getElement(), editFormComponent.getElement());
  };

  itemComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceItemToEditForm();
  });

  editFormComponent.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditFormToItem();
  });

  render(eventsListElement, itemComponent.getElement(), RenderPosition.BEFOREEND);
};

render(tripMain, new TripInfoView(mockRouteCities, mockRouteCost).getElement(), RenderPosition.AFTERBEGIN);
render(tripTabsHeading, new TripTabsView().getElement(), RenderPosition.AFTEREND);
render(tripFiltersHeading, new TripFiltersView().getElement(), RenderPosition.AFTEREND);
render(tripEvents, new TripSortView().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < ITEMS_COUNT; i++) {
  renderEvents(tripEventsListComponent.getElement(), mockRoutePoints[i]);
}
