const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const DRAFT_KEY = "quicknotes-day4-draft";
const THEME_KEY = "quicknotes-day4-theme";
const MAX_CHARS = 200;
const WARNING_LIMIT = 180;

function countWords(text) {
  const trimmedText = text.trim();
  return trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
}

function updateCounters() {
  const characters = noteText.value.length;
  const words = countWords(noteText.value);
  charCount.textContent = `${characters} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} words`;
  charCount.classList.remove("warning", "over");
  if (characters > MAX_CHARS) {
    charCount.classList.add("over");
  } else if (characters > WARNING_LIMIT) {
    charCount.classList.add("warning");
  }
}

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, noteText.value);
}

function restoreDraft() {
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  if (savedDraft !== null) noteText.value = savedDraft;
  updateCounters();
}

function clearNote() {
  noteText.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounters();
  noteText.focus();
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

function restoreTheme() {
  setTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");
}

noteText.addEventListener("input", () => {
  updateCounters();
  saveDraft();
});

clearBtn.addEventListener("click", clearNote);

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
});

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") clearNote();
});

restoreDraft();
restoreTheme();
