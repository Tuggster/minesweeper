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
  } else {
    selectDragActive = false;
  }
  displaySelectionBox();
});

window.addEventListener("mouseup", () => {
  selectDragActive = false;
  displaySelectionBox();
});

const didClickWindow = (element) => {
  if (!element) {
    return false;
  }

  if (!element.parentElement) {
    return false;
  }

  const classList = element.classList;
  if (!classList.contains("draggable")) {
    return didClickWindow(element.parentElement);
  }

  return true;
};

const displaySelectionBox = () => {
  const selectionBox = document.querySelector(".selection-box");

  if (!selectDragActive) {
    selectionBox.style.visibility = "hidden";
    return;
  }

  // organize
  const { x: sX, y: sY } = startPosition;
  const { x: eX, y: eY } = endPosition;

  const width = Math.abs(sX - eX);
  const height = Math.abs(sY - eY);

  // Determine top left of selected box
  const startX = sX < eX ? sX : eX;
  const startY = sY < eY ? sY : eY;

  // apply to css
  selectionBox.style.visibility = "visible";
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.left = `${startX}px`;
  //   selectionBox.style.left = `${100}px`;
};
