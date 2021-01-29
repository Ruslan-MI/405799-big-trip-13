import EventAddView from "../view/event-add.js";
import {
  render,
  remove
} from "../utils/dom-actions.js";
import {
  RenderPosition,
  UserAction
} from "../const.js";

export default class NewEvent {
  constructor(eventListComponent, handleViewAction) {
    this._eventListComponent = eventListComponent;
    this._handleViewAction = handleViewAction;

    this._eventAddComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddSubmit = this._handleAddSubmit.bind(this);
    this._handleAddCancel = this._handleAddCancel.bind(this);
  }

  init() {
    this._disableEventAddButton();

    this._eventAddComponent = new EventAddView();

    this._eventAddComponent.setAddSubmitHandler(this._handleAddSubmit);
    this._eventAddComponent.setAddCancelHandler(this._handleAddCancel);

    render(this._eventListComponent, this._eventAddComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  clear() {
    if (this._eventAddComponent) {
      this.enableEventAddButton();

      remove(this._eventAddComponent);

      this._eventAddComponent = null;

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  resetForError() {
    this._eventAddComponent.resetForError();
  }

  _disableEventAddButton() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  enableEventAddButton() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._handleAddCancel();
    }
  }

  _handleAddSubmit(updateType, addedEvent) {
    this._handleViewAction(UserAction.ADD_EVENT, updateType, addedEvent);
  }

  _handleAddCancel() {
    this.clear();
  }
}
