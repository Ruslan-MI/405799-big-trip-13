import EventAddView from "../view/event-add.js";
import {
  render,
  remove
} from "../utils/dom-actions.js";
import {
  getID
} from "../mock/event.js";
import {
  RenderPosition,
  UpdateType,
  UserAction
} from "../const.js";

export default class NewEvent {
  constructor(eventListComponent, handleViewAction, handleChangeMode) {
    this._eventListComponent = eventListComponent;
    this._handleViewAction = handleViewAction;
    this._handleChangeMode = handleChangeMode;

    this._eventAddComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddSubmit = this._handleAddSubmit.bind(this);
    this._handleAddCancel = this._handleAddCancel.bind(this);
  }

  init() {
    this._buttonDisabled();

    this._eventAddComponent = new EventAddView();

    this._eventAddComponent.setAddSubmitHandler(this._handleAddSubmit);
    this._eventAddComponent.setAddCancelHandler(this._handleAddCancel);

    render(this._eventListComponent, this._eventAddComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  clear() {
    if (this._eventAddComponent) {
      this._buttonEnabled();

      remove(this._eventAddComponent);

      this._eventAddComponent = null;

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _buttonDisabled() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  _buttonEnabled() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._handleAddCancel();
    }
  }

  _handleAddSubmit(updateType, addedEvent) {
    this._handleViewAction(UserAction.ADD_EVENT, updateType, Object.assign({}, addedEvent, {
      id: getID()
    }));

    this.clear();
  }

  _handleAddCancel() {
    this._handleViewAction(UserAction.ADD_EVENT, UpdateType.MAJOR, null);

    this.clear();
  }
}
