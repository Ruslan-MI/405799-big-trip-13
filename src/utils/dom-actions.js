// const renderTemplate = (targetTag, template, place) => {
//   targetTag.insertAdjacentHTML(place, template);
// };

import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const render = (targetTag, element, place) => {
  if (targetTag instanceof Abstract) {
    targetTag = targetTag.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

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

export const replace = (newChild, oldChild) => {
  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements.`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
