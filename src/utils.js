// const renderTemplate = (targetTag, template, place) => {
//   targetTag.insertAdjacentHTML(place, template);
// };

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const render = (targetTag, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      targetTag.prepend(element);
      break;
    case RenderPosition.AFTEREND:
      targetTag.after(element);
      break;
    case RenderPosition.BEFOREEND:
      targetTag.append(element);
      break;
  }
};

export const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};
