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
          case "shortcuts_reveal": {
            setPreferenceValue("shortcuts_reveal", selected);
            break;
          }
          case "shortcuts_flag": {
            setPreferenceValue("shortcuts_flag", selected);
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
          case "guessfree": {
            setPreferenceValue("guessfree", selected);
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

    if (!buttonName || buttonName === "") {
      return;
    }

    let cMenu = this.document.querySelector(`.context-menu > *[name=${buttonName}]`);

    if (!cMenu) {
      return;
    }

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
});
