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
import EmptyListMessageView from "./view/empty-list-message.js";
import {
  getMockRoutePoint
} from "./mock/routePoint.js";

const MAX_ITEMS_COUNT = 3;
const MOCK_ROUTE_POINTS_COUNT = 20;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

const routePoints = new Array(MOCK_ROUTE_POINTS_COUNT).fill().map(getMockRoutePoint);

const routeCities = Array.from(new Set(routePoints.map((point) => {
  return point.city;
})));

const renderEvents = (eventsListElement, routePoint) => {
  const itemComponent = new TripEventsItemView(routePoint);
  const editFormComponent = new EventEditView(routePoint);

  const replaceItemToEditForm = () => {
    eventsListElement.replaceChild(editFormComponent.getElement(), itemComponent.getElement());
  };

  const replaceEditFormToItem = () => {
    eventsListElement.replaceChild(itemComponent.getElement(), editFormComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditFormToItem();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  itemComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceItemToEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editFormComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEditFormToItem();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editFormComponent.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditFormToItem();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsListElement, itemComponent.getElement(), RenderPosition.BEFOREEND);
};

render(tripTabsHeading, new TripTabsView().getElement(), RenderPosition.AFTEREND);
render(tripFiltersHeading, new TripFiltersView().getElement(), RenderPosition.AFTEREND);

const renderTrip = (tripInfoContainer, tripGeneralContainer) => {
  if (Math.min(MAX_ITEMS_COUNT, routePoints.length) === 0) {
    render(tripGeneralContainer, new EmptyListMessageView().getElement(), RenderPosition.BEFOREEND);
  } else {
    const tripEventsListComponent = new TripEventsListView();
    const routeCost = routePoints.map((point) => {
      return point.price;
    }).reduce((a, b) => {
      return a + b;
    });

    render(tripInfoContainer, new TripInfoView(routeCities, routeCost).getElement(), RenderPosition.AFTERBEGIN);
    render(tripGeneralContainer, new TripSortView().getElement(), RenderPosition.BEFOREEND);
    render(tripGeneralContainer, tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

    routePoints.slice(0, Math.min(MAX_ITEMS_COUNT, routePoints.length)).forEach((point) => {
      renderEvents(tripEventsListComponent.getElement(), point);
    });
  }
};

renderTrip(tripMain, tripEvents);
