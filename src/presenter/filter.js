import TripFiltersView from "../view/trip-filters.js";
import {
  RenderPosition,
  UpdateType
} from "../const.js";
import {
  remove,
  render
} from "../utils/dom-actions.js";

export default class Filter {
  constructor(tripFiltersHeading, filterModel, eventsModel) {
    this._tripFiltersHeading = tripFiltersHeading;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._tripFiltersComponent = null;

    this._handleChangeFilterType = this._handleChangeFilterType.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);

    this._filterModel.addObserver(this._handleModelUpdate);
    this._eventsModel.addObserver(this._handleModelUpdate);
  }

  init() {
    remove(this._tripFiltersComponent);

    this._tripFiltersComponent = new TripFiltersView(this._filterModel.getFilter(), this._eventsModel.getEvents());

    render(this._tripFiltersHeading, this._tripFiltersComponent, RenderPosition.AFTEREND);

    this._tripFiltersComponent.setFilterTypeChangeHandler(this._handleChangeFilterType);
  }

  _handleChangeFilterType(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelUpdate(updateType) {
    if (updateType === UpdateType.MAJOR) {
      this.init();
    }
  }
}
