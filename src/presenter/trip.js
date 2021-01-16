import {
  render,
  RenderPosition
} from "../utils/dom-actions.js";
import {
  updateItem
} from "../utils/common.js";
import {
  SortType
} from "../view/trip-sort.js";
import {
  sortDay,
  sortTime,
  sortPrice
} from "../utils/common.js";
import TripInfoView from "../view/trip-info.js";
import TripSortView from "../view/trip-sort.js";
import EventListView from "../view/trip-events-list.js";
import EmptyListMessageView from "../view/empty-list-message.js";
import EventPresenter from "../presenter/event.js";

const MAX_ITEMS_COUNT = 3;

export default class Trip {
  constructor(tripInfoContainer, tripGeneralContainer) {
    this._infoContainer = tripInfoContainer;
    this._generalContainer = tripGeneralContainer;
    this._eventPresenters = {};
    this._defaultSortType = SortType.DAY;

    this._updateRoutePoint = this._updateRoutePoint.bind(this);
    this._changeModeHandler = this._changeModeHandler.bind(this);
    this._changeSortType = this._changeSortType.bind(this);
  }

  init(routePoints) {
    this._sourcedRoutePoints = routePoints.slice(0, Math.min(MAX_ITEMS_COUNT, routePoints.length));
    this._routePoints = routePoints.slice(0, Math.min(MAX_ITEMS_COUNT, routePoints.length));
    this._sortRoutePoints(this._defaultSortType);

    if (this._routePoints.length === 0) {
      this._renderEmptyListMessage();
    } else {
      this._renderTrip();
    }
  }

  _renderEmptyListMessage() {
    this._emptyListMessageComponent = new EmptyListMessageView();

    render(this._generalContainer, this._emptyListMessageComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._routePoints);

    render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripSort() {
    this._tripSortComponent = new TripSortView();

    render(this._generalContainer, this._tripSortComponent, RenderPosition.BEFOREEND);

    this._tripSortComponent.setSortTypeChangeHandler(this._changeSortType);
  }

  _renderEventList() {
    this._eventListComponent = new EventListView();

    render(this._generalContainer, this._eventListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(routePoint) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._updateRoutePoint, this._changeModeHandler);

    this._eventPresenters[routePoint.id] = eventPresenter;

    eventPresenter.init(routePoint);
  }

  _renderEvents() {
    this._routePoints.forEach((routePoint) => {
      this._renderEvent(routePoint);
    });
  }

  _renderTrip() {
    this._renderTripInfo();
    this._renderTripSort();
    this._renderEventList();
    this._renderEvents();
  }

  _updateRoutePoint(changedRoutePoint) {
    this._routePoints = updateItem(this._routePoints, changedRoutePoint);
    this._eventPresenters[changedRoutePoint.id].init(changedRoutePoint);
  }

  _clearEvents() {
    Object.values(this._eventPresenters).forEach((presenter) => {
      presenter.clear();
    });

    this._eventPresenters = {};
  }

  _changeModeHandler() {
    Object.values(this._eventPresenters).forEach((presenter) => presenter.resetView());
  }

  _sortRoutePoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._routePoints.sort(sortDay);
        break;
      case SortType.TIME:
        this._routePoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this._routePoints.sort(sortPrice);
        break;
    }
  }

  _changeSortType(sortType) {
    this._sortRoutePoints(sortType);
    this._clearEvents();
    this._renderEvents();
  }
}
