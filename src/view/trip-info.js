import Abstract from "./abstract.js";

const createTripInfoTemplate = (cities, cost) => {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${cities.length > 3 ? cities[0] + ` &mdash;...&mdash; ` + cities[cities.length - 1] : cities.join(` &mdash; `)}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
</section>`;
};

export default class TripInfo extends Abstract {
  constructor(routePoints) {
    super();
    this._routeCities = this._getRouteCities(routePoints);
    this._routeCost = this._getRouteCost(routePoints);
  }

  _getRouteCities(routePoints) {
    return Array.from(new Set(routePoints.map((point) => {
      return point.city;
    })));
  }

  _getRouteCost(routePoints) {
    return routePoints.map((point) => {
      return point.price;
    }).reduce((a, b) => {
      return a + b;
    });
  }

  getTemplate() {
    return createTripInfoTemplate(this._routeCities, this._routeCost);
  }
}
