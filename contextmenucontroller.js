let hoveringMain = false;

window.addEventListener("load", function () {
  let radios = this.document.querySelectorAll(".cmenu-radio");
  radios.forEach((radio) => {
    let choices = radio.children;

    choices.forEach((element) => {
      element.onRadioToggle = function (selected) {
        switch (element.id) {
          case "collapse": {
            setPreferenceValue("collapsed", selected);
            break;
          }
          case "shortcuts": {
            setPreferenceValue("shortcuts", selected);
            break;
          }
          case "saturation": {
            setPreferenceValue("color", selected);
            break;
          }
          case "marks": {
            setPreferenceValue("marks", selected);
            break;
          }
        }
      };

      element.addEventListener("click", function () {
        if (element.classList.contains("selected")) {
          if (radio.classList.contains("optional")) {
            element.classList.remove("selected");
            element?.onRadioToggle?.(false);
          }
        } else {
          let selected = radio.querySelector(".cmenu-radio .selected");
          if (selected) {
            selected.classList.remove("selected");
            selected?.onRadioToggle?.(false);
          }

          element?.onRadioToggle?.(true);
          element.classList.add("selected");
        }
      });
    });
  });

  const leaderboardCtx = document.querySelector("#leaderboard-ctx");

  const newNode = this.document.createElement("p");
  const nameFromLs = this.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  newNode.innerHTML = getNameButtonText();
  newNode.addEventListener("click", leaderboardNamePrompt);
  newNode.id = "leaderboard-ctx-name";
  leaderboardCtx.appendChild(newNode);

  document.querySelector("main").addEventListener("mouseenter", () => {
    hoveringMain = true;
  });

  document.querySelector("main").addEventListener("mouseleave", () => {
    hoveringMain = false;
  });

  let barButtons = this.document.querySelectorAll(".options-bar *");
  barButtons.forEach((button) => {
    let buttonName = button.getAttribute("name");
    let cMenu = this.document.querySelector(`.context-menu > *[name=${buttonName}]`);
    cMenu.style.visibility = "hidden";

    let btnPos = button.getBoundingClientRect();
    let menuPos = cMenu.getBoundingClientRect();

    button.addEventListener("mouseenter", function () {
      btnPos = button.getBoundingClientRect();
      menuPos = cMenu.getBoundingClientRect();

      cMenu.style.visibility = "visible";
      cMenu.style.top = `${btnPos.bottom}px`;
      cMenu.style.left = `${btnPos.left}px`;
      contextOpen = true;
    });

    button.addEventListener("mouseout", (event) => {
      if (event.clientX <= btnPos.left || event.clientX >= btnPos.right || event.clientY <= btnPos.top) {
        cMenu.style.visibility = "hidden";
        contextOpen = false;
      }
    });

    cMenu.addEventListener("mouseleave", function () {
      cMenu.style.visibility = "hidden";
      contextOpen = false;
    });
  });

  let difficultyButtons = this.document.getElementById("difficulty");
  let difficultySelectors = difficultyButtons.children;

  setDifficulty(1);

  difficultySelectors.forEach((el, index, arr) => {
    el.addEventListener("click", () => {
      setDifficulty(index);
      newGame();
    });
  });

  let draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    let header = draggable.children[0].children[0];
    header.addEventListener("mousemove", (event) => {
      if (event.buttons & 1) {
        if (!dragging) {
          dragging = true;
          startX = event.clientX;
          startY = event.clientY;
        } else {
          let diffX = startX - event.clientX;
          let diffY = startY - event.clientY;

          let newLeft = draggable.style.left.split("px")[0] - diffX;
          let newTop = draggable.style.top.split("px")[0] - diffY;

          draggable.style.left = `${newLeft}px`;
          draggable.style.top = `${newTop}px`;

          startX = event.clientX;
          startY = event.clientY;
        }
      } else {
        dragging = false;
      }
    });
  });
});

let dragging = false;
let startX = 0;
let startY = 0;
