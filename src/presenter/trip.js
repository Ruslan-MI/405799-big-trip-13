import TripInfoView from "../view/trip-info.js";
import TripSortView from "../view/trip-sort.js";
import EventListView from "../view/trip-events-list.js";
import EmptyListMessageView from "../view/empty-list-message.js";
import EventPresenter from "./event.js";
import NewEventPresenter from "./new-event.js";
import {
  RenderPosition,
  UserAction,
  UpdateType,
  SortType
} from "../const.js";
import {
  render,
  remove
} from "../utils/dom-actions.js";
import {
  sortDay,
  sortTime,
  sortPrice,
  filter
} from "../utils/common.js";

export default class Trip {
  constructor(tripInfoContainer, tripGeneralContainer, eventsModel, offersModel, cityExpositionsModel, filterModel) {
    this._infoContainer = tripInfoContainer;
    this._generalContainer = tripGeneralContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offers = offersModel.getData();
    this._cityExpositions = cityExpositionsModel.getData();
    this._eventPresenters = {};
    this._defaultFilter = this._filterModel.getFilter();
    this._currentFilter = this._defaultFilter;
    this._defaultSortType = SortType.DAY;
    this._currentSortType = this._defaultSortType;

    this._emptyListMessageComponent = new EmptyListMessageView();
    this._eventListComponent = new EventListView();
    this._tripInfoComponent = null;
    this._tripSortComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleChangeMode = this._handleChangeMode.bind(this);
    this._handleChangeSortType = this._handleChangeSortType.bind(this);

    this._eventsModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);

    this._newEventPresenter =
      new NewEventPresenter(this._eventListComponent, this._handleViewAction, this._handleChangeMode, this._offers, this._cityExpositions);
  }

  init() {
    this._renderTrip();
  }

  createEvent(button) {
    if (this._getEvents().length === 0) {
      remove(this._emptyListMessageComponent);
      this._renderEventList();
    } else {
      this._handleChangeMode();
      this._currentSortType = this._defaultSortType;
      this._filterModel.setFilter(UpdateType.MAJOR, this._defaultFilter);
    }

    this._newEventPresenter.init(button);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(sortDay);
      case SortType.TIME:
        return filteredEvents.sort(sortTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortPrice);
      default:
        throw new Error(`Unexpected sort type`);
    }
  }

  _renderEmptyListMessage() {
    render(this._generalContainer, this._emptyListMessageComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._getEvents());

    render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripSort() {
    this._tripSortComponent = new TripSortView(this._currentSortType);

    render(this._generalContainer, this._tripSortComponent, RenderPosition.BEFOREEND);

    this._tripSortComponent.setSortTypeChangeHandler(this._handleChangeSortType);
  }

  _renderEventList() {
    render(this._generalContainer, this._eventListComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter =
      new EventPresenter(this._eventListComponent, this._handleViewAction, this._handleChangeMode, this._offers, this._cityExpositions);

    this._eventPresenters[event.id] = eventPresenter;

    eventPresenter.init(event);
  }

  _renderEvents() {
    this._getEvents().forEach((event) => {
      this._renderEvent(event);
    });
  }

  _clearEvents() {
    Object.values(this._eventPresenters).forEach((presenter) => {
      presenter.clear();
    });

    this._eventPresenters = {};
  }

  _renderTrip() {
    if (this._getEvents().length === 0) {
      this._renderEmptyListMessage();
    } else {
      this._renderTripInfo();
      this._renderTripSort();
      this._renderEventList();
      this._renderEvents();
    }
  }

  _clearTrip() {
    this._newEventPresenter.clear();

    this._clearEvents();

    remove(this._eventListComponent);
    remove(this._tripSortComponent);
    remove(this._tripInfoComponent);
    remove(this._emptyListMessageComponent);
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelUpdate(updateType, data) {
    if (typeof data === `string` && this._currentFilter !== data) {
      this._currentFilter = data;
      this._currentSortType = this._defaultSortType;
      this._newEventPresenter.clear();
    }

    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearEvents();
        this._renderEvents();
        break;
      case UpdateType.MAJOR:
        this._clearTrip();
        this._renderTrip();
        break;
    }
  }

  _handleChangeMode() {
    this._newEventPresenter.clear();

    Object.values(this._eventPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleChangeSortType(sortType) {
    this._currentSortType = sortType;
    this._newEventPresenter.clear();

    this._clearEvents();
    this._renderEvents();
  }
}
