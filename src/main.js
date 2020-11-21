import {
  createTripInfoTemplate
} from "./view/trip-info.js";
import {
  createTripTabsTemplate
} from "./view/trip-tabs.js";
import {
  createTripFiltersTemplate
} from "./view/trip-filters.js";
import {
  createTripSortTemplate
} from "./view/trip-sort.js";
import {
  createTripEventsListTemplate
} from "./view/trip-events-list.js";
import {
  createEventEditTemplate
} from "./view/event-edit.js";
import {
  createAddFormButtonsTemplate
} from "./view/add-form-buttons.js";
import {
  createEditFormButtonsTemplate
} from "./view/edit-form-buttons.js";
import {
  createEventDetailsTemplate
} from "./view/event-details.js";
import {
  createOffersTemplate
} from "./view/offers.js";
import {
  createDestinationTemplate
} from "./view/destination.js";
import {
  createLoadingMessageTemplate
} from "./view/loading-message.js";
import {
  createTripEventsItemTemplate
} from "./view/trip-events-item.js";
import {
  createEmptyListMessageTemplate
} from "./view/empty-list-message.js";
import {
  createStatisticsTemplate
} from "./view/statistics.js";

const ITEMS_COUNT = 3;

const pageHeader = document.querySelector(`.page-header`);
const tripMain = pageHeader.querySelector(`.trip-main`);
const tripTabsHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(1)`);
const tripFiltersHeading = pageHeader.querySelector(`.trip-controls h2:nth-child(2)`);
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

const renderTemplate = (targetTag, template, place) => {
  targetTag.insertAdjacentHTML(place, template);
};

const renderFormTemplate = (buttons) => {
  renderTemplate(tripEventsList, createEventEditTemplate(), `beforeend`);

  const eventHeader = tripEventsList.querySelector(`li:last-child .event__header`);

  renderTemplate(eventHeader, buttons(), `beforeend`);
};

renderTemplate(tripMain, createTripInfoTemplate(), `afterbegin`);
renderTemplate(tripTabsHeading, createTripTabsTemplate(), `afterend`);
renderTemplate(tripFiltersHeading, createTripFiltersTemplate(), `afterend`);
renderTemplate(tripEvents, createTripSortTemplate(), `beforeend`);
renderTemplate(tripEvents, createTripEventsListTemplate(), `beforeend`);

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

renderFormTemplate(createEditFormButtonsTemplate);
renderFormTemplate(createAddFormButtonsTemplate);

const eventEdit = tripEventsList.querySelector(`.event--edit`);

renderTemplate(eventEdit, createEventDetailsTemplate(), `beforeend`);

const eventDetails = eventEdit.querySelector(`.event__details`);

renderTemplate(eventDetails, createOffersTemplate(), `beforeend`);
renderTemplate(eventDetails, createDestinationTemplate(), `beforeend`);

for (let i = 0; i < ITEMS_COUNT; i++) {
  renderTemplate(tripEventsList, createTripEventsItemTemplate(), `beforeend`);
}

renderTemplate(tripEvents, createLoadingMessageTemplate(), `beforeend`);
renderTemplate(tripEvents, createEmptyListMessageTemplate(), `beforeend`);
renderTemplate(tripEvents, createStatisticsTemplate(), `afterend`);
