let color = document.getElementById("color");
let createBtn = document.getElementById("createBtn");
let list = document.getElementById("list");
let clearBtn = document.getElementById("clearBtn");

// createBtn.onclick =  () => {
//     let newNote = document.createElement("div");
//     newNote.className = "note";
//     newNote.innerHTML = `
//                 <span class="close">x</span>
//                 <textarea placeholder="Enter your note here..." rows="10" cols="30"></textarea>`;
//     list.appendChild(newNote);
//     newNote.style.borderColor = color.value;
// }

// document.addEventListener("click", (e) => {
//     if(e.target.classList.contains('close')){
//         e.target.parentNode.remove();
//     }
// })


let cursor = {
    x: null,
    y: null
}
let note = {
    dom: null,
    x: null,
    y: null
}

document.addEventListener("mousedown", (e) => {
    if(e.target.classList.contains('note')){
        cursor = {
            x: e.clientX,
            y: e.clientY
        }
        note = {
            dom: e.target,
            x: e.target.getBoundingClientRect().left,
            y: e.target.getBoundingClientRect().top
        }
    }
})

document.addEventListener('mousemove', (e) => {
    if(note.dom == null) return;
    let currentCursor = {
        x: e.clientX,
        y: e.clientY
    }
    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    }
    note.dom.style.left = (note.x + distance.x) + 'px';
    note.dom.style.top = (note.y + distance.y) + 'px';
    note.dom.style.cursor = 'grab';
})

// document.addEventListener('mouseup', () => {
//     if(note.dom == null) return;
//     note.dom = null;
//     note.dom.style.cursor = 'auto';
// })

clearBtn.onclick = () => {
    if (confirm("Are you sure you want to delete all notes?")) {
        document.querySelectorAll(".note").forEach(note => note.remove());
        localStorage.removeItem("notes");
        newNote.style.borderColor = color;
    }
};

// above the commented out code don't save the notes resets after every page reload 

// Load notes from localStorage on page load

function createNote({ content = "", color = "#000000", left = "100px", top = "100px" } = {}) {
    let newNote = document.createElement("div");
    newNote.className = "note";
    newNote.style.position = "absolute";
    newNote.style.left = left;
    newNote.style.top = top;
    newNote.style.borderColor = color;

    newNote.innerHTML = `
        <span class="close">x</span>
        <textarea placeholder="Enter your note here..." rows="10" cols="30">${content}</textarea>
    `;

    // Save content when the user types
    newNote.querySelector("textarea").addEventListener("input", saveNotes);

    list.appendChild(newNote);
    saveNotes();
}

createBtn.onclick = () => {
    createNote({
        content: "",
        color: color.value,
        left: "100px",
        top: "100px"
    });
};

document.addEventListener("click", (e) => {
    if (e.target.classList.contains('close')) {
        e.target.parentNode.remove();
        saveNotes();
    }
});

document.addEventListener('mouseup', () => {
    if (note.dom == null) return;
    note.dom.style.cursor = 'auto';
    note.dom = null;
    saveNotes();
});

function saveNotes() {
    let notes = [];
    document.querySelectorAll(".note").forEach(note => {
        let textarea = note.querySelector("textarea");
        notes.push({
            content: textarea.value,
            color: note.style.borderColor,
            left: note.style.left,
            top: note.style.top
        });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}

window.onload = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    savedNotes.forEach(noteData => createNote(noteData));
};
