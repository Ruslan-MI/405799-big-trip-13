import AbstractView from "./abstract.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  getEventTypes,
  getEventTypePrices,
  getEventTypeQuantity,
  getTypeTimeSpend
} from "../utils/common.js";

const BAR_HEIGHT = 55;

const createStatisticsTemplate = () => {
  return `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

const renderMoneyChart = (moneyCtx, eventTypes, eventTypePrices) => {
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        barThickness: 44,
        minBarLength: 50,
        data: eventTypePrices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTypeChart = (typeCtx, eventTypes, eventTypeQuantity) => {
  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        barThickness: 44,
        minBarLength: 50,
        data: eventTypeQuantity,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TYPE`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeCtx, eventTypes, typeTimeSpend) => {
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        barThickness: 44,
        minBarLength: 50,
        data: typeTimeSpend,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}D`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

export default class Statistics extends AbstractView {
  constructor(events) {
    super();

    this._eventTypes = getEventTypes(events);
    this._eventTypePrices = getEventTypePrices(events);
    this._eventTypeQuantity = getEventTypeQuantity(events);
    this._typeTimeSpend = getTypeTimeSpend(events);

    this._moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    this._typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    this._timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyCtx.height = BAR_HEIGHT * this._eventTypes.length;
    this._typeCtx.height = BAR_HEIGHT * this._eventTypes.length;
    this._timeCtx.height = BAR_HEIGHT * this._eventTypes.length;

    this._moneyChart = renderMoneyChart(this._moneyCtx, this._eventTypes, this._eventTypePrices);
    this._typeChart = renderTypeChart(this._typeCtx, this._eventTypes, this._eventTypeQuantity);
    this._timeSpendChart = renderTimeSpendChart(this._timeCtx, this._eventTypes, this._typeTimeSpend);
  }

  getTemplate() {
    return createStatisticsTemplate();
  }
}
