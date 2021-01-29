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
    this._listComponent = eventListComponent;
    this._handleViewAction = handleViewAction;
    this._handleChangeMode = handleChangeMode;
    this._mode = Mode.DEFAULT;

    this._itemComponent = null;
    this._editComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleItemRollupClick = this._handleItemRollupClick.bind(this);
    this._handleEditRollupClick = this._handleEditRollupClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditSubmit = this._handleEditSubmit.bind(this);
    this._handleEditDelete = this._handleEditDelete.bind(this);
  }

  init(event) {
    this._data = event;

    const createdEventItemComponent = this._itemComponent;
    const createdEventEditComponent = this._editComponent;

    this._itemComponent = new EventItemView(event);
    this._editComponent = new EventEditView(event);

    this._itemComponent.setRollupClickHandler(this._handleItemRollupClick);
    this._editComponent.setRollupClickHandler(this._handleEditRollupClick);
    this._itemComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editComponent.setSubmitHandler(this._handleEditSubmit);
    this._editComponent.setDeleteHandler(this._handleEditDelete);

    if (createdEventItemComponent === null || createdEventEditComponent === null) {
      render(this._listComponent, this._itemComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._itemComponent, createdEventItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, createdEventEditComponent);
    }

    remove(createdEventItemComponent);
    remove(createdEventEditComponent);
  }

  clear() {
    remove(this._itemComponent);
    remove(this._editComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._handleEditRollupClick();
    }
  }

  resetForError() {
    switch (this._mode) {
      case Mode.DEFAULT:
        this._itemComponent.resetForError();
        break;
      case Mode.EDITING:
        this._editComponent.resetForError();
        break;
    }
  }

  _handleItemRollupClick() {
    replace(this._editComponent, this._itemComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._handleChangeMode();
    this._mode = Mode.EDITING;
  }

  _handleEditRollupClick() {
    replace(this._itemComponent, this._editComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
    this._editComponent.reset(this._data);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._handleEditRollupClick();
    }
  }

  _handleFavoriteClick() {
    this._handleViewAction(UserAction.UPDATE_EVENT, UpdateType.PATCH, Object.assign({}, this._data, {
      isFavorite: !this._data.isFavorite
    }));
  }

  _handleEditSubmit(updateType, changedEvent) {
    this._handleViewAction(UserAction.UPDATE_EVENT, updateType, changedEvent);
  }

  _handleEditDelete(deletedEvent) {
    this._handleViewAction(UserAction.DELETE_EVENT, UpdateType.MAJOR, deletedEvent);
  }
}
