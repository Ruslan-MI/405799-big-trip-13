import {
  render, replace, RenderPosition, remove
} from "../utils/dom-actions.js";
import EventEditView from "../view/event-edit.js";
import EventItemView from "../view/trip-events-item.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(eventListComponent, updateRoutePoint, changeModeHandler) {
    this._eventListComponent = eventListComponent;
    this._updateRoutePoint = updateRoutePoint;
    this._changeModeHandler = changeModeHandler;

    this._eventItemComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._EscKeyDownHandler = this._EscKeyDownHandler.bind(this);
    this._eventItemRollupClickHandler = this._eventItemRollupClickHandler.bind(this);
    this._eventEditRollupClickHandler = this._eventEditRollupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
  }

  init(routePoint) {
    this._routePoint = routePoint;

    const createdEventItemComponent = this._eventItemComponent;
    const createdEventEditComponent = this._eventEditComponent;

    this._eventItemComponent = new EventItemView(routePoint);
    this._eventEditComponent = new EventEditView(routePoint);

    this._eventItemComponent.setRollupClickHandler(this._eventItemRollupClickHandler);
    this._eventEditComponent.setRollupClickHandler(this._eventEditRollupClickHandler);
    this._eventEditComponent.setEditSubmitHandler(this._editSubmitHandler);
    this._eventItemComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    if (createdEventItemComponent === null || createdEventEditComponent === null) {
      render(this._eventListComponent, this._eventItemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventItemComponent, createdEventItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, createdEventEditComponent);
    }

    remove(createdEventItemComponent);
    remove(createdEventEditComponent);
  }

  clear() {
    remove(this._eventItemComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventEditRollupClickHandler();
    }
  }

  _eventItemRollupClickHandler() {
    replace(this._eventEditComponent, this._eventItemComponent);
    document.addEventListener(`keydown`, this._EscKeyDownHandler);
    this._changeModeHandler();
    this._mode = Mode.EDITING;
  }

  _eventEditRollupClickHandler() {
    replace(this._eventItemComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._EscKeyDownHandler);
    this._mode = Mode.DEFAULT;
    this._eventEditComponent.reset(this._routePoint);
  }

  _EscKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditRollupClickHandler();
    }
  }

  _favoriteClickHandler() {
    this._updateRoutePoint(Object.assign({}, this._routePoint, {isFavorite: !this._routePoint.isFavorite}));
  }

  _editSubmitHandler(changedRoutePoint) {
    this._updateRoutePoint(changedRoutePoint);
    this._eventEditRollupClickHandler();
  }
}
