import dayjs from "dayjs";

const cityData = {
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
  return getRandomLength(cityData.photos).map((photo) => {
    const alt = cityData.description[getRandomIndex(cityData.description)];

    return {
      src: photo,
      alt
    };
  });
};

const getCityDescriptions = () => {
  return cityData.city.map((cityName) => {
    return {
      description: getConcatenation(getRandomLength(cityData.description)),
      name: cityName,
      photos: getPhotos()
    };
  });
};

export const cityDescriptions = getCityDescriptions();

export const offerTypes = [
  {
    type: `flight`,
    offers: [
      {
        title: `Add luggage`,
        price: `30`,
      },
      {
        title: `Switch to comfort class`,
        price: `100`,
      },
      {
        title: `Add meal`,
        price: `15`,
      },
      {
        title: `Choose seats`,
        price: `5`,
      },
      {
        title: `Travel by train`,
        price: `40`,
      }
    ]
  },
  {
    type: `taxi`,
    offers: [
      {
        title: `Upgrade to a business class`,
        price: `120`
      },
      {
        title: `Choose the radio station`,
        price: `60`
      }
    ]
  }
];

export const eventTypes = [
  `taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`
];

export const offersClassMap = {
  [`Add luggage`]: `luggage`,
  [`Switch to comfort class`]: `comfort`,
  [`Add meal`]: `meal`,
  [`Choose seats`]: `seats`,
  [`Travel by train`]: `train`,
  [`Upgrade to a business class`]: `business`,
  [`Choose the radio station`]: `radio`
};

export const getMockRoutePoint = () => {
  return {
    id: (Math.floor(Math.random() * 100000)),
    type: eventTypes[6],
    city: cityData.city[getRandomIndex(cityData.city)],
    offers: offerTypes.find((data) => data.type === eventTypes[6]).offers.slice(Math.floor(Math.random() * 5)),
    price: Math.ceil(Math.random() * 500) + 100,
    startTime: dayjs().toDate(),
    endTime: dayjs().add((Math.ceil(Math.random() * 4)), `hour`).add((Math.ceil(Math.random() * 59)), `minute`).toDate(),
    isFavorite: getTrueOrFalse()
  };
};
