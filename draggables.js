let dragTarget = undefined;

// Handle ongoing drags
window.addEventListener("mousemove", () => {
  if (dragTarget) {
    if (!dragging) {
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      //   elementParentStyle.zIndex = ACTIVE_WINDOW_Z_INDEX;
      draggables.forEach((d) => {
        d.style.zIndex = INACTIVE_WINDOW_Z_INDEX;
      });
      dragTarget.style.zIndex = ACTIVE_WINDOW_Z_INDEX;
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

// Stop drag if in progress
window.addEventListener("mouseup", () => {
  dragTarget = undefined;
  dragging = false;
});

window.addEventListener("load", () => {
  let draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    let header = draggable.children[0].children[0];
    header.addEventListener("mousedown", (event) => {
      if (event.buttons & 1) {
        dragTarget = draggable;
      }
    });
  });
});

let dragging = false;
let startX = 0;
let startY = 0;
