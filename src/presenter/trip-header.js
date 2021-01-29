import TripInfoView from "../view/trip-info.js";
import TripFiltersView from "../view/trip-filters.js";
import {
  RenderPosition,
  UpdateType
} from "../const.js";
import {
  remove,
  render
} from "../utils/dom-actions.js";

export default class TripHeader {
  constructor(tripInfoContainer, tripFiltersHeading, filterModel, eventsModel) {
    this._infoContainer = tripInfoContainer;
    this._tripFiltersHeading = tripFiltersHeading;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._tripInfoComponent = null;
    this._tripFiltersComponent = null;

    this._handleChangeFilterType = this._handleChangeFilterType.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
  }

  init() {
    this._filterModel.addObserver(this._handleModelUpdate);
    this._eventsModel.addObserver(this._handleModelUpdate);

    this._resetTripInfo();
    this._resetFilter();
  }

  _resetFilter() {
    remove(this._tripFiltersComponent);

    this._tripFiltersComponent = new TripFiltersView(this._filterModel.getType(), this._eventsModel.getData());

    render(this._tripFiltersHeading, this._tripFiltersComponent, RenderPosition.AFTEREND);

    this._tripFiltersComponent.setTypeChangeHandler(this._handleChangeFilterType);
  }

  _resetTripInfo() {
    remove(this._tripInfoComponent);

    const events = this._eventsModel.getData();

    if (events.length !== 0) {
      this._tripInfoComponent = new TripInfoView(events);

      render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _handleChangeFilterType(filterType) {
    this._filterModel.removeObserver(this._handleModelUpdate);
    this._filterModel.setType(UpdateType.MAJOR, filterType);
    this._filterModel.addObserver(this._handleModelUpdate);
  }

  _handleModelUpdate(updateType, data) {
    if (typeof data !== `string`) {
      this._resetTripInfo();
    }

    if (updateType === UpdateType.MAJOR) {
      this._resetFilter();
    }
  }
}
