// the selection box thing...

let selectDragActive = false;
const startPosition = { x: 0, y: 0 };
const endPosition = { x: 0, y: 0 };

window.addEventListener("mousemove", (event) => {
  if (event.buttons & 1) {
    // Starting a new drag
    if (!selectDragActive) {
      if (didClickWindow(event.target)) {
        return;
      }

      selectDragActive = true;
      startPosition.x = event.clientX;
      startPosition.y = event.clientY;
    }

    endPosition.x = event.clientX;
    endPosition.y = event.clientY;

    doSelectionBoxLogic(getSanePositions());
  } else {
    selectDragActive = false;
  }
  displaySelectionBox();
});

window.addEventListener("mouseup", () => {
  if (selectDragActive) {
    selectDragActive = false;
    doSelectionBoxLogic(getSanePositions());
    displaySelectionBox();
  }
});

const didClickWindow = (element) => {
  return !!findParentOfClass(element, "draggable");
};

const findParentOfClass = (element, classname) => {
  if (!element) {
    return null;
  }

  if (!element.parentElement) {
    return null;
  }

  const classList = element.classList;
  if (!classList.contains(classname)) {
    return findParentOfClass(element.parentElement, classname);
  }

  return element;
};

const getSanePositions = () => {
  // organize
  const { x: sX, y: sY } = startPosition;
  const { x: eX, y: eY } = endPosition;

  const width = Math.abs(sX - eX);
  const height = Math.abs(sY - eY);

  // Determine top left of selected box
  const x = sX < eX ? sX : eX;
  const y = sY < eY ? sY : eY;

  return { x, y, width, height };
};

const containedInSelection = (x, y, width, height, positions) => {
  const rightEdge = x + width;
  const bottomEdge = y + height;

  const containerRightEdge = positions.x + positions.width;
  const containerBottomEdge = positions.y + positions.height;

  const xContained = (x >= positions.x || rightEdge >= positions.x) && !(x >= containerRightEdge);

  const yContained = (y >= positions.y || bottomEdge >= positions.y) && !(y >= containerBottomEdge);

  return xContained && yContained;
};

const doSelectionBoxLogic = (boxPositions) => {
  const desktopItems = Array.from(document.querySelectorAll(".desktop > div"));
  desktopItems.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    const contained = containedInSelection(bounds.x, bounds.y, bounds.width, bounds.height, boxPositions);

    if (contained) {
      element.classList.add("selected");
    } else {
      element.classList.remove("selected");
    }
  });
};

const displaySelectionBox = () => {
  const selectionBox = document.querySelector(".selection-box");

  if (!selectDragActive) {
    selectionBox.style.visibility = "hidden";
    return;
  }

  const { x, y, width, height } = getSanePositions();

  // apply to css
  selectionBox.style.visibility = "visible";
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
  selectionBox.style.left = `${x}px`;
  selectionBox.style.top = `${y}px`;
  //   selectionBox.style.left = `${100}px`;
};

const desktopClickHandler = (event) => {
  const positions = {
    x: event.pageX,
    y: event.pageY,
    width: 1,
    height: 1,
  };

  doSelectionBoxLogic(positions);
};

window.addEventListener("mousedown", desktopClickHandler);

// Doubleclick

const desktopDoubleclickHandler = (event) => {
  const target = event.target;

  if (!target) {
    return;
  }

  const parent = findParentOfClass(target, "icon");
  const configItem = DESKTOP_CONFIG[parent.id];

  if (!configItem) {
    return;
  }

  configItem?.clickHandler();
};

window.addEventListener("load", () => {
  const desktopIcons = document.querySelectorAll(".desktop > .icon");

  desktopIcons.forEach((icon) => {
    icon.addEventListener("dblclick", desktopDoubleclickHandler);
  });
});
