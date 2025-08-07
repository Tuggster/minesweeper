let leaderboardData = [];

const createDifficultyHash = () => MD5(`${game.width},${game.height},${game.mines}`);

const getLeaderboardForDifficulty = async (shouldShow) => {
  const difficultyHash = createDifficultyHash();
  const results = await fetch(`${SERVER_URL}/leaderboard/difficulty?difficulty=${difficultyHash}`);
  const body = await results.json();
  leaderboardData = body;
  updateLeaderboard();

  if (shouldShow) {
    showLeaderboard();
  }
};

const leaderboardNamePrompt = () => {
  const name = prompt("Enter name for leaderboard!");
  localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, name);
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

  const payload = {
    difficulty: difficultyHash,
    handle: username,
    time: game.gameTimer / 1000,
    proof: "imlazy",
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

const updateLeaderboard = () => {
  const leaderboardTable = document.querySelector("#leaderboard-data");
  leaderboardTable.innerHTML = "";
  const labels = ["username", "time (seconds)"];
  addEach(leaderboardTable, labels, "th");

  leaderboardData.forEach((score) => {
    const style = score.isYou ? 'style="background-color: gold;"' : "";
    const values = [score.handle, score.time];
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
