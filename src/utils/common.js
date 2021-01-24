import dayjs from "dayjs";
import {
  UpdateType,
  FilterType
} from "../const.js";

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

export const getCheckedType = (data, type) => {
  if (data.type === type) {
    return `checked`;
  }

  return ``;
};

export const getCheckedOffer = (data, offer) => {
  if (data.offers.some((dataOffer) => dataOffer.title === offer.title)) {
    return `checked`;
  }

  return ``;
};

export const getCityNames = (cityDescriptions) => {
  return cityDescriptions.map((city) => city.name);
};

export const getIdForTitle = (title) => {
  return title.split(` `).join(`-`).toLowerCase();
};

export const getAvailableOffers = (allOffers, type) => {
  return allOffers.find((offersData) => offersData.type === type) ?
    allOffers.find((offersData) => offersData.type === type).offers : [];
};

export const getRequiredUpdate = (data, update) => {
  const isTypeChanged = Boolean(data.type !== update.type);
  const isCityChanged = Boolean(data.city !== update.city);
  const dataOfferTitles = data.offers.map((offer) => offer.title);
  const updateOfferTitles = update.offers.map((offer) => offer.title);
  const isOffersChanged = Boolean(!((dataOfferTitles.every((title) => updateOfferTitles.includes(title)))
    && (updateOfferTitles.every((title) => dataOfferTitles.includes(title)))));
  const isPriceChanged = Boolean(data.price !== update.price);
  const isStartTimeChanged = Boolean(dayjs(data.startTime).diff(update.startTime) !== 0);
  const isEndTimeChanged = Boolean(dayjs(data.endTime).diff(update.endTime) !== 0);

  if (isCityChanged || isStartTimeChanged || isEndTimeChanged || isPriceChanged || isOffersChanged) {
    return UpdateType.MAJOR;
  } else if (isTypeChanged) {
    return UpdateType.PATCH;
  }

  return false;
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((point) => point.startTime >= dayjs().toDate()),
  [FilterType.PAST]: (events) => events.filter((point) => point.endTime < dayjs().toDate()),
};

export const getFilterDisable = (events, filterType) => {
  return filter[filterType](events).length > 0 ? `` : `disabled`;
};

export const reducer = (a, b) => a + b;
