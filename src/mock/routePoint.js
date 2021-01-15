import dayjs from "dayjs";

const pointData = {
  type: [
    `Flight`
  ],
  city: [
    `Amsterdam`,
    `Chamonix`,
    `Geneva`
  ],
  description: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ],
  photos: [
    `./img/photos/1.jpg`,
    `./img/photos/2.jpg`,
    `./img/photos/3.jpg`,
    `./img/photos/4.jpg`,
    `./img/photos/5.jpg`
  ]
};

const getTrueOrFalse = () => {
  return Boolean(Math.round(Math.random()));
};

const offersTypeMap = {
  Flight: [
    {
      title: `luggage`,
      price: `30`,
      isChecked: getTrueOrFalse()
    },
    {
      title: `comfort`,
      price: `100`,
      isChecked: getTrueOrFalse()
    },
    {
      title: `meal`,
      price: `15`,
      isChecked: getTrueOrFalse()
    },
    {
      title: `seats`,
      price: `5`,
      isChecked: getTrueOrFalse()
    },
    {
      title: `train`,
      price: `40`,
      isChecked: getTrueOrFalse()
    }
  ]
};

const getRandomIndex = (data) => {
  return Math.floor(Math.random() * data.length);
};

const getRandomLength = (data) => {
  return data.slice(0, getRandomIndex(data));
};

const getConcatenation = ([...rows]) => {
  return `${rows.join(` `)}`;
};

const getPhotos = () => {
  return getRandomLength(pointData.photos).map((photo) => {
    const alt = pointData.description[getRandomIndex(pointData.description)];

    return {
      src: photo,
      alt
    };
  });
};

export const eventTypes = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`
];

export const offersTitleMap = {
  luggage: `Add luggage`,
  comfort: `Switch to comfort class`,
  meal: `Add meal`,
  seats: `Choose seats`,
  train: `Travel by train`
};

export const getMockRoutePoint = () => {
  return {
    id: (Math.floor(Math.random() * 100000)),
    type: pointData.type[0],
    city: pointData.city[getRandomIndex(pointData.city)],
    offers: offersTypeMap[pointData.type],
    price: Math.ceil(Math.random() * 500) + 100,
    description: getConcatenation(getRandomLength(pointData.description)),
    photos: getPhotos(),
    startTime: dayjs().toDate(),
    endTime: dayjs().add((Math.ceil(Math.random() * 4)), `hour`).add((Math.ceil(Math.random() * 59)), `minute`).toDate(),
    isFavorite: getTrueOrFalse()
  };
};
