import EventEditView from "../view/event-edit.js";
import EventItemView from "../view/trip-events-item.js";
import {
  render,
  replace,
  remove
} from "../utils/dom-actions.js";
import {
  RenderPosition,
  UserAction,
  UpdateType
} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(eventListComponent, handleViewAction, handleChangeMode) {
    this._eventListComponent = eventListComponent;
    this._handleViewAction = handleViewAction;
    this._handleChangeMode = handleChangeMode;
    this._mode = Mode.DEFAULT;

    this._eventItemComponent = null;
    this._eventEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEventItemRollupClick = this._handleEventItemRollupClick.bind(this);
    this._handleEventEditRollupClick = this._handleEventEditRollupClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditSubmit = this._handleEditSubmit.bind(this);
    this._handleEditDelete = this._handleEditDelete.bind(this);
  }

  init(event) {
    this._event = event;

    const createdEventItemComponent = this._eventItemComponent;
    const createdEventEditComponent = this._eventEditComponent;

    this._eventItemComponent = new EventItemView(event);
    this._eventEditComponent = new EventEditView(event);

    this._eventItemComponent.setRollupClickHandler(this._handleEventItemRollupClick);
    this._eventEditComponent.setRollupClickHandler(this._handleEventEditRollupClick);
    this._eventItemComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setEditSubmitHandler(this._handleEditSubmit);
    this._eventEditComponent.setEditDeleteHandler(this._handleEditDelete);

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
      this._handleEventEditRollupClick();
    }
  }

  resetForError() {
    switch (this._mode) {
      case Mode.DEFAULT:
        this._eventItemComponent.resetForError();
        break;
      case Mode.EDITING:
        this._eventEditComponent.resetForError();
        break;
    }
  }

  _handleEventItemRollupClick() {
    replace(this._eventEditComponent, this._eventItemComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._handleChangeMode();
    this._mode = Mode.EDITING;
  }

  _handleEventEditRollupClick() {
    replace(this._eventItemComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
    this._eventEditComponent.reset(this._event);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._handleEventEditRollupClick();
    }
  }

  _handleFavoriteClick() {
    this._handleViewAction(UserAction.UPDATE_EVENT, UpdateType.PATCH, Object.assign({}, this._event, {
      isFavorite: !this._event.isFavorite
    }));
  }

  _handleEditSubmit(updateType, changedEvent) {
    this._handleViewAction(UserAction.UPDATE_EVENT, updateType, changedEvent);
  }

  _handleEditDelete(deletedEvent) {
    this._handleViewAction(UserAction.DELETE_EVENT, UpdateType.MAJOR, deletedEvent);
  }
}
