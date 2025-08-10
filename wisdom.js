let wisdom = "";

const loadWisdom = async () => {
  wisdom = await getDailyWisdom();
  applyWisdomToNotepad();
};

const applyWisdomToNotepad = () => {
  const textarea = document.getElementById("notebox-text");
  textarea.innerHTML = wisdom;
  textarea.value = wisdom;
};

const getDailyWisdom = async () => {
  const results = await fetch(`${SERVER_URL}/wisdoms/today`);

  return await results.text();
};

loadWisdom();
