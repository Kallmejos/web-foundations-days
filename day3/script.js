// Day 3 - Notes Toolkit

let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search notes by text, ignoring upper/lower case.
function searchNotes(word) {
  const searchWord = String(word).toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchWord));
}

// 2. Find the note with the most characters.
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

// 3. Count notes by category.
function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (!counts[note.category]) {
      counts[note.category] = 0;
    }
    counts[note.category]++;
  }

  return counts;
}

// 4. Return a readable summary.
function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

// 5. Check whether a note with the same trimmed, lower-case text exists.
function isDuplicate(text) {
  const normalizedText = String(text).trim().toLowerCase();

  return notes.some(
    (note) => note.text.trim().toLowerCase() === normalizedText
  );
}

// 6. Add a valid, non-duplicate note.
function addNote(text, category) {
  const cleanText = String(text).trim();
  const validCategories = ["personal", "work", "study"];

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log("Reason: note text must be 1–200 characters.");
    return false;
  }

  if (isDuplicate(cleanText)) {
    console.log("Reason: duplicate note text.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Reason: category must be personal, work or study.");
    return false;
  }

  const newId = notes.length === 0
    ? 1
    : Math.max(...notes.map((note) => note.id)) + 1;

  notes.push({
    id: newId,
    text: cleanText,
    category: category,
  });

  return true;
}

// Tests: searchNotes
console.log("searchNotes('Day 3'):", searchNotes("Day 3"));
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]

console.log("searchNotes('pizza'):", searchNotes("pizza"));
// Expected: []

// Tests: longestNote
console.log("longestNote():", longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

const savedNotesForEmptyTest = notes;
notes = [];
console.log("longestNote() with empty array:", longestNote());
// Expected: null
notes = savedNotesForEmptyTest;

// Tests: countByCategory
console.log("countByCategory():", countByCategory());
// Expected: { personal: 2, study: 2, work: 1 } (property order may vary)

const savedNotesForCountTest = notes;
notes = [{ id: 1, text: "Only note", category: "personal" }];
console.log("countByCategory() with one note:", countByCategory());
// Expected: { personal: 1 }
notes = savedNotesForCountTest;

// Tests: getSummary
console.log("getSummary():", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

const savedNotesForSummaryTest = notes;
notes = [{ id: 1, text: "Only note", category: "personal" }];
console.log("getSummary() with one note:", getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."
notes = savedNotesForSummaryTest;

// Tests: isDuplicate
console.log("isDuplicate('  BUY MILK AND BREAD  '):", isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true

console.log("isDuplicate('Learn CSS Grid'):", isDuplicate("Learn CSS Grid"));
// Expected: false

// Tests: addNote
console.log("addNote('Plan weekend trip', 'personal'):", addNote("Plan weekend trip", "personal"));
// Expected: true

console.log("addNote(' Buy milk and bread ', 'personal'):", addNote(" Buy milk and bread ", "personal"));
// Expected: false, and the console logs the duplicate reason

console.log("addNote('', 'study'):", addNote("", "study"));
// Expected: false, and the console logs the length reason

console.log("addNote('Practice JavaScript', 'music'):", addNote("Practice JavaScript", "music"));
// Expected: false, and the console logs the category reason
