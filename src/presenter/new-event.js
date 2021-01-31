import EventAddView from "../view/event-add.js";
import {
  render,
  remove
} from "../utils/dom-actions.js";
import {
  isOnline
} from "../utils/common.js";
import {
  toast
} from "../utils/toast/toast.js";
import {
  RenderPosition,
  UserAction
} from "../const.js";

export default class NewEvent {
  constructor(eventListComponent, handleViewAction) {
    this._listComponent = eventListComponent;
    this._handleViewAction = handleViewAction;

    this._addComponent = null;
    this._addButton = document.querySelector(`.trip-main__event-add-btn`);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddSubmit = this._handleAddSubmit.bind(this);
    this._handleAddCancel = this._handleAddCancel.bind(this);
  }

  init() {
    this._disableAddButton();

    this._addComponent = new EventAddView();

    this._addComponent.setSubmitHandler(this._handleAddSubmit);
    this._addComponent.setCancelHandler(this._handleAddCancel);

    render(this._listComponent, this._addComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  clear() {
    if (this._addComponent) {
      this.enableAddButton();

      remove(this._addComponent);

      this._addComponent = null;

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  resetForError(isLeaveInputsDisabled) {
    this._addComponent.resetForError(isLeaveInputsDisabled);
  }

  _disableAddButton() {
    this._addButton.disabled = true;
  }

  enableAddButton() {
    this._addButton.disabled = false;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._handleAddCancel();
    }
  }

  _handleAddSubmit(updateType, addedEvent) {
    if (!isOnline()) {
      toast(`You can't save event offline`);

      this.resetForError(true);

      return;
    }

    this._handleViewAction(UserAction.ADD_EVENT, updateType, addedEvent);
  }

  _handleAddCancel() {
    this.clear();
  }
}
