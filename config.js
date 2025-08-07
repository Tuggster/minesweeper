SERVER_URL = 'https://minesweeper-leaderboard.tuggi.dev';
// SERVER_URL = 'http://localhost:3001';
LOCAL_STORAGE_USERNAME_KEY = "ms_lb_username";
LOCAL_STORAGE_COLLAPSE_KEY = "ms_lb_collapsed";
LOCAL_STORAGE_SHORTCUTS_KEY = "ms_shortcuts_enabled";
LOCAL_STORAGE_COLOR_KEY = "ms_color_enabled";
LOCAL_STORAGE_MARKS_KEY = "ms_marks_enabled";

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
    name: "shortcuts",
    onChange: (state) => {
      handleRadioUpdate("shortcuts", state);
    },
    onLsLoad: (value) => {
      return value === "true";
    },
    lsKey: LOCAL_STORAGE_SHORTCUTS_KEY,
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
];

document.addEventListener("DOMContentLoaded", () => {
  initPrefValuesFromLs();
});
