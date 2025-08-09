// API
SERVER_URL = "https://minesweeper-leaderboard.tuggi.dev";
// SERVER_URL = 'http://localhost:3001';
LEADERBOARD_ENABLED = true;

// Local Storage
LOCAL_STORAGE_USERNAME_KEY = "ms_lb_username";
LOCAL_STORAGE_COLLAPSE_KEY = "ms_lb_collapsed";
LOCAL_STORAGE_SHORTCUTS_REVEAL_KEY = "ms_shortcuts_reveal_enabled";
LOCAL_STORAGE_SHORTCUTS_FLAG_KEY = "ms_shortcuts_flag_enabled";
LOCAL_STORAGE_COLOR_KEY = "ms_color_enabled";
LOCAL_STORAGE_MARKS_KEY = "ms_marks_enabled";
LOCAL_STORAGE_GUESS_FREE_KEY = "ms_guess_free";

// Window Management
ACTIVE_WINDOW_Z_INDEX = 10;
INACTIVE_WINDOW_Z_INDEX = 9;

// name
// onChange ==> (state) => ...
// local storage key
// value

const setPreferenceValue = (key, value) => {
  const pref = preferences.find((p) => p.name === key);

  if (!pref) {
    return;
  }

  pref.value = value;

  this.localStorage.setItem(pref.lsKey, value);
  pref.onChange(value);
};

const getPreferenceValue = (key) => {
  const pref = preferences.find((p) => p.name === key);

  return pref?.value ?? undefined;
};

const initPrefValuesFromLs = () => {
  preferences.forEach((p) => {
    const lsValue = this.localStorage.getItem(p.lsKey);

    if (lsValue) {
      p.value = p.onLsLoad(lsValue);
    } else {
      this.localStorage.setItem(p.lsKey, p.value);
    }

    p.onChange(p.value);
  });
};

const handleRadioUpdate = (id, state) => {
  const radioEl = this.document.getElementById(id);
  if (state) {
    radioEl.classList.add("selected");
  } else {
    radioEl.classList.remove("selected");
  }
};

const preferences = [
  {
    name: "collapsed",
    onChange: toggleCollapsed,
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_COLLAPSE_KEY,
    value: false,
  },
  {
    name: "shortcuts_reveal",
    onChange: (state) => {
      handleRadioUpdate("shortcuts_reveal", state);
    },
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_SHORTCUTS_REVEAL_KEY,
    value: true,
  },
  {
    name: "shortcuts_flag",
    onChange: (state) => {
      handleRadioUpdate("shortcuts_flag", state);
    },
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_SHORTCUTS_FLAG_KEY,
    value: false,
  },
  {
    name: "marks",
    onChange: (state) => {
      handleRadioUpdate("marks", state);
    },
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_MARKS_KEY,
    value: false,
  },
  {
    name: "color",
    onChange: (state) => {
      handleRadioUpdate("saturation", state);

      document.body.style.filter = `saturate(${state ? 1 : 0})`;
      document.body.style.backdropFilter = `saturate(${state ? 1 : 0})`;
    },
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_COLOR_KEY,
    value: true,
  },
  {
    name: "guessfree",
    onChange: (state) => {
      handleRadioUpdate("guessfree", state);
      newGame();
    },
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_GUESS_FREE_KEY,
    value: false,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  initPrefValuesFromLs();
});
