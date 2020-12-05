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
  let index = Math.floor(Math.random() * data.length);
  return index;
};

const getRandomElements = (data, min, max) => {
  let newArray = [];
  let newArrayLength = Math.round(Math.random() * max) + min;
  while (newArray.length !== newArrayLength) {
    let randomValue = data[getRandomIndex(data)];
    let isDuplicate = newArray.includes(randomValue);
    if (!isDuplicate) {
      newArray.push(randomValue);
    }
  }
  return newArray;
};

const getConcatenation = ([...rows]) => {
  return `${rows.join(` `)}`;
};

export const getMockRoutePoint = () => {
  return {
    type: pointData.type[0],
    city: pointData.city[getRandomIndex(pointData.city)],
    offers: offersTypeMap[pointData.type],
    price: Math.ceil(Math.random() * 500) + 100,
    description: getConcatenation(getRandomElements(pointData.description, 1, 5)),
    photos: getRandomElements(pointData.photos, 1, 5),
    startTime: dayjs().toDate(),
    endTime: dayjs().add((Math.ceil(Math.random() * 4)), `hour`).add((Math.ceil(Math.random() * 59)), `minute`).toDate(),
    isFavorite: getTrueOrFalse()
  };
};
