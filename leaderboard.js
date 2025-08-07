let leaderboardData = [];
let collapsed = false;

const toggleCollapsed = (state) => {
  getLeaderboardForDifficulty(false);
  handleRadioUpdate("collapse", state);
};

const getCollapsed = () => {
  return this.localStorage.getItem(LOCAL_STORAGE_COLLAPSE_KEY) === "true";
};

const createDifficultyHash = () => MD5(`${game.width},${game.height},${game.mines}`);

const getLeaderboardForDifficulty = async (shouldShow) => {
  const difficultyHash = createDifficultyHash();
  const shouldCollapse = getCollapsed();

  const results = await fetch(
    `${SERVER_URL}/leaderboard/difficulty?difficulty=${difficultyHash}&collapse=${shouldCollapse}`
  );
  const body = await results.json();
  leaderboardData = body;
  updateLeaderboard();

  if (shouldShow) {
    showLeaderboard();
  }
};

const getNameButtonText = () => {
  const nameFromLs = this.localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  return nameFromLs ? `Change username (${nameFromLs})` : "Set username";
};

const leaderboardNamePrompt = () => {
  const name = prompt("Enter name for leaderboard!");
  localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, name);

  const leaderboardCtxName = document.querySelector("#leaderboard-ctx-name");
  leaderboardCtxName.innerHTML = getNameButtonText();

  return name;
};

const getLeaderboardName = () => {
  let name = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);

  if (!name) {
    name = leaderboardNamePrompt();
  }

  return name;
};

const uploadToLeaderboard = async () => {
  const username = getLeaderboardName();
  const difficultyHash = createDifficultyHash();
  const time = game.gameTimer / 1000;
  const shouldCollapse = getCollapsed();

  const payload = {
    difficulty: difficultyHash,
    handle: username,
    time: Number(time.toFixed(2)),
    proof: "imlazy",
    collapse: shouldCollapse,
  };

  const headers = new Headers();
  headers.append("content-type", "application/json");

  const results = await fetch(`${SERVER_URL}/leaderboard/completed`, {
    body: JSON.stringify(payload),
    method: "POST",
    headers,
  });

  const body = await results.json();
  leaderboardData = body;
  updateLeaderboard();
  showLeaderboard();
};

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const updateLeaderboard = () => {
  const leaderboardTable = document.querySelector("#leaderboard-data");
  leaderboardTable.innerHTML = "";
  const labels = ["username", "time (seconds)", "date"];
  addEach(leaderboardTable, labels, "th");

  leaderboardData.forEach((score, index) => {
    const style = score.isYou ? 'style="background-color: gold;"' : "";
    const time = new Date(score.createdAt);

    const handle = index === 0 ? `${score.handle} 👑` : score.handle;

    const values = [handle, score.time, formatDateToYYYYMMDD(time)];
    addEach(leaderboardTable, values, undefined, style);
  });
};

const addEach = (leaderboardTable, values, as, style) => {
  let row = `<tr ${style}>`;
  values.forEach((value) => {
    row += `<${as ?? "td"}>`;
    row += value;
    row += `</${as ?? "td"}>`;
  });
  row += "</tr>";
  leaderboardTable.innerHTML += row;
};

const hideLeaderboard = () => {
  const leaderboard = document.querySelector(".leaderboard");
  leaderboard.style.visibility = "hidden";
};

const showLeaderboard = () => {
  const leaderboard = document.querySelector(".leaderboard");
  leaderboard.style.visibility = "visible";
};
