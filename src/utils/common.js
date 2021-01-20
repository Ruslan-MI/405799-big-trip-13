import dayjs from "dayjs";

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
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

export const getCheckedType = (data, type) => {
  if (data.type === type) {
    return `checked`;
  }

  return ``;
};

export const getCheckedOffer = (data, offer) => {
  if (data.offers.includes(offer)) {
    return `checked`;
  }

  return ``;
};

export const getCityNames = (cityDescriptions) => {
  return cityDescriptions.map((city) => city.name);
};
