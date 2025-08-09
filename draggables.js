let dragTarget = undefined;
let draggables = new Array();

const promoteZIndex = (id) => {
  // Shuffle everyone who was above me, down 1.
  draggables = draggables.sort((a, b) => {
    return a.zIndex - b.zIndex;
  });
  const elementIndex = draggables.findIndex((d) => d.id === id);

  draggables.slice(elementIndex + 1).forEach((draggable) => {
    draggable.zIndex = draggable.zIndex - 1;
  });

  // Raise Z-index of this element to top of stack
  draggables[elementIndex].zIndex = draggables.length - 1;

  applyZIndicies();
};

const findWindowByClickAndPromote = (element) => {
  if (!element.parentElement) {
    return;
  }

  const classList = element.classList;
  if (!classList.contains("draggable")) {
    return findWindowByClickAndPromote(element.parentElement);
  }

  if (!element.id) {
    return;
  }

  promoteZIndex(element.id);
};

const applyZIndicies = () => {
  draggables.forEach((d) => {
    targetIndex = d.zIndex + WINDOW_Z_INDEX_STACK_START;

    d.element.style.zIndex = targetIndex;
  });
};

// Handle ongoing drags
window.addEventListener("mousemove", () => {
  if (dragTarget) {
    if (!dragging) {
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      promoteZIndex(dragTarget.id);
    } else {
      let diffX = startX - event.clientX;
      let diffY = startY - event.clientY;

      let newLeft = dragTarget.style.left.split("px")[0] - diffX;
      let newTop = dragTarget.style.top.split("px")[0] - diffY;

      dragTarget.style.left = `${newLeft}px`;
      dragTarget.style.top = `${newTop}px`;

      startX = event.clientX;
      startY = event.clientY;
    }
  }
});

window.addEventListener("click", (event) => {
  const target = event.target;

  if (!target) {
    return;
  }

  findWindowByClickAndPromote(target);
});

// Stop drag if in progress
window.addEventListener("mouseup", () => {
  dragTarget = undefined;
  dragging = false;
});

window.addEventListener("load", () => {
  draggables = Array.from(document.querySelectorAll(".draggable")).map((element, index) => {
    const defaults = WINDOW_DEFAULTS[element.id];

    return {
      id: element.id,
      element,
      zIndex: index,
      open: defaults?.visibility ?? false,
    };
  });

  draggables.forEach((draggable) => {
    let header = draggable.element.children[0].children[0];
    header.addEventListener("mousedown", (event) => {
      if (event.buttons & 1) {
        dragTarget = draggable.element;
      }
    });

    processDraggable(draggable);
  });
});

const setWindowVisibility = (id, visibility) => {
  const draggable = draggables.find((d) => d.id === id);
  draggable.open = visibility;

  processDraggables();
};

const processDraggables = () => {
  draggables.forEach((d) => {
    processDraggable(d);
  });
};

const processDraggable = (draggable) => {
  if (draggable.open) {
    draggable.element.style.visibility = "visible";
  } else {
    draggable.element.style.visibility = "hidden";
  }
};

let dragging = false;
let startX = 0;
let startY = 0;
