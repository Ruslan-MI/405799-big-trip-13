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
import {
  isOnline
} from "../utils/common.js";
import {
  toast
} from "../utils/toast/toast.js";

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

    const createdItemComponent = this._itemComponent;

    this._itemComponent = new EventItemView(event);

    this._itemComponent.setRollupClickHandler(this._handleItemRollupClick);
    this._itemComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (createdItemComponent === null) {
      render(this._listComponent, this._itemComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._itemComponent, createdItemComponent);

    remove(createdItemComponent);
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

  resetForError(isLeaveInputsDisabled) {
    switch (this._mode) {
      case Mode.DEFAULT:
        this._itemComponent.resetForError();
        break;
      case Mode.EDITING:
        this._editComponent.resetForError(isLeaveInputsDisabled);
        break;
    }
  }

  _getEditMode() {
    this._editComponent = new EventEditView(this._data);

    replace(this._editComponent, this._itemComponent);

    this._editComponent.setRollupClickHandler(this._handleEditRollupClick);
    this._editComponent.setSubmitHandler(this._handleEditSubmit);
    this._editComponent.setDeleteHandler(this._handleEditDelete);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._handleChangeMode();
    this._mode = Mode.EDITING;
  }

  _handleItemRollupClick() {
    if (!isOnline()) {
      toast(`You can't edit event offline`);

      this.resetForError();

      return;
    }

    this._getEditMode();
  }

  _handleEditRollupClick() {
    replace(this._itemComponent, this._editComponent);
    remove(this._editComponent);

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
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
    if (!isOnline()) {
      toast(`You can't save event offline`);

      this.resetForError(true);

      return;
    }

    this._handleViewAction(UserAction.UPDATE_EVENT, updateType, changedEvent);
  }

  _handleEditDelete(deletedEvent) {
    if (!isOnline()) {
      toast(`You can't delete event offline`);

      this.resetForError(true);

      return;
    }

    this._handleViewAction(UserAction.DELETE_EVENT, UpdateType.MAJOR, deletedEvent);
  }
}
