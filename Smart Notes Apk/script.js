document.addEventListener("DOMContentLoaded", function() {
    loadNotes();

    // Add event listener for search input
    document.getElementById("search-input").addEventListener("input", searchNotes);
});

let editingNoteIndex = null; // Track the index of the note being edited

// Add a new note
function addNote() {
    let noteTitle = document.getElementById("note-title").value.trim();
    let noteText = document.getElementById("note-input").value.trim();
    let noteTags = document.getElementById("note-tags").value.trim(); // Get tags
    let tagsArray = noteTags === "" ? [] : noteTags.split(",").map(tag => tag.trim()); // Split into array

    if (noteText === "") {
        return;
    }

    if (editingNoteIndex !== null) {
        // Update existing note
        updateNote(editingNoteIndex, noteTitle, noteText, tagsArray);
        editingNoteIndex = null; // Reset editing index
    } else {
        // Add new note
        let noteObj = {
            title: noteTitle,
            text: noteText,
            tags: tagsArray, // Add tags
            timestamp: new Date().toLocaleString()
        };
        saveNoteToLocal(noteObj);
    }
    displayNotes();
    document.getElementById("note-input").value = "";
    document.getElementById("note-title").value = "";
    document.getElementById("note-tags").value = ""; // Clear tags input
}

// Load notes from local storage and display them
function loadNotes() {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    displayNotes();
}

function displayNotes(searchTerm = "") {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let container = document.getElementById("notes-container");
    container.innerHTML = "";

    notes.forEach((note, index) => {
        // Filter notes based on search term
        if (searchTerm && !note.title.toLowerCase().includes(searchTerm.toLowerCase()) && !note.text.toLowerCase().includes(searchTerm.toLowerCase()) && !note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return; // Skip this note if it doesn't match the search term
        }

        let noteElement = document.createElement("div");
        noteElement.classList.add("note");

        // Display tags
        let tagsHTML = note.tags ? note.tags.map(tag => `<span class="tag">${tag}</span>`).join("") : ""; // Handle undefined tags

        noteElement.innerHTML = `
            <h3>${note.title ? note.title : 'No Title'}</h3>
            <p>${note.text}</p>
            <div class="tags-container">${tagsHTML}</div>
            <small>${note.timestamp}</small>
            <button onclick="editNote(${index})">Edit</button>
            <button onclick="deleteNote(${index})">Delete</button>
        `;
        container.appendChild(noteElement);
    });
}

// Save notes in local storage
function saveNoteToLocal(note) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Delete a note
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
}

// Edit a note
function editNote(index) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let note = notes[index];
    document.getElementById("note-title").value = note.title || ""; // Handle undefined title
    document.getElementById("note-input").value = note.text;
    document.getElementById("note-tags").value = note.tags ? note.tags.join(",") : ""; // Handle undefined tags
    editingNoteIndex = index; // Set the index of the note being edited
}

// Update a note in local storage
function updateNote(index, newTitle, newText, newTags) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes[index].title = newTitle;
    notes[index].text = newText;
    notes[index].tags = newTags; // Update tags
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Search notes
function searchNotes() {
    let searchTerm = document.getElementById("search-input").value.trim();
    displayNotes(searchTerm);
}