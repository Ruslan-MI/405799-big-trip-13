import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import {
  UpdateType,
  FilterType
} from "../const.js";

const getTimeRows = (data, sign, isShowZeroes) => {
  if (data === 0 && !isShowZeroes) {
    return ``;
  }

  return data < 10 ? `0${data + sign}` : data + sign;
};

export const sortDay = (pointA, pointB) => {
  if (dayjs(pointA.startTime) < dayjs(pointB.startTime)) {
    return -1;
  }

  if (dayjs(pointA.startTime) > dayjs(pointB.startTime)) {
    return 1;
  }

  return 0;
};

export const sortTime = (pointA, pointB) => {
  if (dayjs(pointA.endTime).diff(pointA.startTime) < dayjs(pointB.endTime).diff(pointB.startTime)) {
    return 1;
  }

  if (dayjs(pointA.endTime).diff(pointA.startTime) > dayjs(pointB.endTime).diff(pointB.startTime)) {
    return -1;
  }

  return 0;
};

export const sortPrice = (pointA, pointB) => {
  if (pointA.price < pointB.price) {
    return 1;
  }

  if (pointA.price > pointB.price) {
    return -1;
  }

  return 0;
};

export const getCheckedType = (data, type) => data.type === type ? `checked` : ``;

export const getCheckedOffer = (data, offer) =>
  data.offers.some((dataOffer) => dataOffer.title === offer.title) ? `checked` : ``;

export const getCityNames = (destinations) =>
  destinations.map((destination) => destination.name);

export const getIdForTitle = (title) =>
  title.split(` `).join(`-`).toLowerCase();

export const getAvailableOffers = (allOffers, type) =>
  allOffers.find((offersData) => offersData.type === type) ?
    allOffers.find((offersData) => offersData.type === type).offers : [];

export const getRequiredUpdate = (data, update) => {
  const isTypeChanged = Boolean(data.type !== update.type);
  const isDestinationChanged = Boolean(data.destination.name !== update.destination.name);
  const dataOfferTitles = data.offers.map((offer) => offer.title);
  const updateOfferTitles = update.offers.map((offer) => offer.title);
  const isOffersChanged = Boolean(!((dataOfferTitles.every((title) => updateOfferTitles.includes(title)))
    && (updateOfferTitles.every((title) => dataOfferTitles.includes(title)))));
  const isPriceChanged = Boolean(data.price !== update.price);
  const isStartTimeChanged = Boolean(dayjs(data.startTime).diff(update.startTime) !== 0);
  const isEndTimeChanged = Boolean(dayjs(data.endTime).diff(update.endTime) !== 0);

  if (isStartTimeChanged || isEndTimeChanged) {
    return UpdateType.MAJOR;
  }

  if (isPriceChanged) {
    return UpdateType.MINOR;
  }

  if (isTypeChanged || isDestinationChanged || isOffersChanged) {
    return UpdateType.PATCH;
  }

  return false;
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((point) => point.startTime >= new Date()),
  [FilterType.PAST]: (events) => events.filter((point) => point.endTime < new Date()),
};

export const getFilterDisable = (events, filterType) =>
  filter[filterType](events).length > 0 ? `` : `disabled`;

export const reducer = (a, b) => a + b;

export const getEventTypes = (data) =>
  [...new Set(data.map((event) => event.type))];

export const getEventTypePrices = (data) =>
  getEventTypes(data).map((type) =>
    data.filter((event) => event.type === type).map((event) => event.price).reduce(reducer));

export const getEventTypeQuantity = (data) =>
  getEventTypes(data).map((type) =>
    data.filter((event) => event.type === type).length);

export const getTypeTimeSpend = (data) =>
  getEventTypes(data).map((type) =>
    dayjs.duration(data.filter((event) => event.type === type).map((event) => dayjs(event.endTime).diff(event.startTime)).reduce(reducer)).days());

export const getEventDuration = (data) => {
  const eventDuration = dayjs.duration(dayjs(data.endTime).diff(data.startTime));

  const days = eventDuration.days();
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  const isForciblyShowHours = days > 0 ? true : false;

  return `${[getTimeRows(days, `D`), getTimeRows(hours, `H`, isForciblyShowHours), getTimeRows(minutes, `M`, true)].join(` `).trim()}`;
};

export const getTripDatesRange = (events) => {
  const trip = events.sort(sortDay);
  const startTripDate = trip[0].startTime;
  const startTripMonth = dayjs(startTripDate).month();
  const startTripYear = dayjs(startTripDate).year();
  const endTripDate = trip[trip.length - 1].endTime;
  const endTripMonth = dayjs(endTripDate).month();
  const endTripYear = dayjs(endTripDate).year();

  return startTripYear === endTripYear && startTripMonth === endTripMonth ?
    `${dayjs(startTripDate).format(`MMM D`)}&nbsp;&mdash;&nbsp;${dayjs(endTripDate).format(`D`)}` :
    `${dayjs(startTripDate).format(`MMM D`)}&nbsp;&mdash;&nbsp;${dayjs(endTripDate).format(`MMM D`)}`;
};

export const getEventCities = (events) => {
  const eventCities = [];
  let previousCity = null;

  events.sort(sortDay).forEach((event) => {
    if (event.destination.name === previousCity) {
      return;
    }

    previousCity = event.destination.name;

    eventCities.push(event.destination.name);
  });

  return eventCities.length > 3 ? `${eventCities[0]}&mdash;...&mdash;${eventCities[eventCities.length - 1]}` : eventCities.join(` &mdash; `);
};

export const getEventCost = (events) =>
  events.map((event) =>
    [event.price, ...event.offers.map((offer) => offer.price)].reduce(reducer)).reduce(reducer);
