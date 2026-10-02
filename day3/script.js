// Day 3 - Notes Toolkit

let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  const searchTerm = String(word).toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, note) =>
    note.text.length > longest.text.length ? note : longest
  );
}

function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  notes.forEach((note) => {
    if (Object.prototype.hasOwnProperty.call(counts, note.category)) {
      counts[note.category]++;
    }
  });
  return counts;
}

function getSummary() {
  const counts = countByCategory();
  return `${notes.length} notes: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

function isDuplicate(text) {
  const normalizedText = String(text).trim().replace(/\s+/g, " ").toLowerCase();
  return notes.some(
    (note) => note.text.trim().replace(/\s+/g, " ").toLowerCase() === normalizedText
  );
}

function addNote(text, category) {
  const normalizedText = String(text).trim().replace(/\s+/g, " ");

  if (normalizedText.length < 1 || normalizedText.length > 200) {
    console.log("Note not added: text must be 1–200 characters.");
    return false;
  }

  if (isDuplicate(normalizedText)) {
    console.log("Note not added: a note with the same text already exists.");
    return false;
  }

  const validCategories = ["personal", "work", "study"];
  if (!validCategories.includes(category)) {
    console.log("Note not added: category must be personal, work or study.");
    return false;
  }

  const nextId = notes.length > 0 ? Math.max(...notes.map((note) => note.id)) + 1 : 1;
  notes.push({ id: nextId, text: normalizedText, category });
  return true;
}

// Tests / expected results
console.log("searchNotes('day 3'):", searchNotes("day 3"));
// Expected: note with id 2

console.log("longestNote():", longestNote());
// Expected: note with id 3

console.log("countByCategory():", countByCategory());
// Expected: { personal: 2, work: 1, study: 2 }

console.log("getSummary():", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

console.log("isDuplicate('  BUY   MILK AND BREAD  '):", isDuplicate("  BUY   MILK AND BREAD  "));
// Expected: true

console.log("isDuplicate('Learn DOM events'):", isDuplicate("Learn DOM events"));
// Expected: false

console.log("addNote('Plan weekend trip', 'personal'):", addNote("Plan weekend trip", "personal"));
// Expected: true

console.log("addNote(' Buy milk and bread ', 'personal'):", addNote(" Buy milk and bread ", "personal"));
// Expected: false, with a duplicate reason logged

console.log("addNote('', 'study'):", addNote("", "study"));
// Expected: false, with a length reason logged

console.log("addNote('Practice JavaScript', 'invalid'):", addNote("Practice JavaScript", "invalid"));
// Expected: false, with a category reason logged

console.log("Final summary:", getSummary());
// Expected: "6 notes: 3 personal, 1 work, 2 study."
