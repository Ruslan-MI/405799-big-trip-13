import {
  render, replace, RenderPosition
} from "./utils/dom-actions.js";
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

const renderEvents = (eventsListElement, routePoint) => {
  const itemComponent = new TripEventsItemView(routePoint);
  const editFormComponent = new EventEditView(routePoint);

  const replaceItemToEditForm = () => {
    replace(editFormComponent, itemComponent);
  };

  const replaceEditFormToItem = () => {
    replace(itemComponent, editFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditFormToItem();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  itemComponent.setRollupClickHandler(() => {
    replaceItemToEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editFormComponent.setRollupClickHandler(() => {
    replaceEditFormToItem();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editFormComponent.setEditSubmitHandler(() => {
    replaceEditFormToItem();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsListElement, itemComponent, RenderPosition.BEFOREEND);
};

render(tripTabsHeading, new TripTabsView(), RenderPosition.AFTEREND);
render(tripFiltersHeading, new TripFiltersView(), RenderPosition.AFTEREND);

const renderTrip = (tripInfoContainer, tripGeneralContainer) => {
  if (Math.min(MAX_ITEMS_COUNT, routePoints.length) === 0) {
    render(tripGeneralContainer, new EmptyListMessageView(), RenderPosition.BEFOREEND);
  } else {
    const tripEventsListComponent = new TripEventsListView();

    render(tripInfoContainer, new TripInfoView(routePoints), RenderPosition.AFTERBEGIN);
    render(tripGeneralContainer, new TripSortView(), RenderPosition.BEFOREEND);
    render(tripGeneralContainer, tripEventsListComponent, RenderPosition.BEFOREEND);

    routePoints.slice(0, Math.min(MAX_ITEMS_COUNT, routePoints.length)).forEach((point) => {
      renderEvents(tripEventsListComponent, point);
    });
  }
};

renderTrip(tripMain, tripEvents);
