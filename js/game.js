// ======== TEMA OSCURO =====
window.addEventListener("load", () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
});

// ======== PALABRAS POR NIVEL =====
const levels = {
    facil: {
        words: ["MUISCAS", "TAYRONAS", "QUIMBAYA", "ARHUACOS", "GUANE", "PASTOS", "TUNJA", "CACIQUE"],
        directions: ["H", "V"]
    },
    medio: {
        words: ["SOGAMOSO", "BOYACÁ", "ORFEBRERIA", "MOMIA", "ZENU", "CHIBCHAS"],
        directions: ["H", "HR", "V", "VR"]
    },
    dificil: {
        words: ["BACHUE", "GUATAVITA", "MITO", "DORADO"],
        directions: ["H", "HR", "V", "VR", "D", "DR"]
    }
};

let currentLevel = localStorage.getItem("nivel") || "facil";
let words = levels[currentLevel].words;
let allowedDirections = levels[currentLevel].directions;

// ======== GRID Y VARIABLES =====
const gridSize = 12;
const grid = document.getElementById("grid");
const wordList = document.getElementById("wordList");

let board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
let selected = [];
let foundWords = [];

// ======== FUNCIONES GRID =====
function createEmptyGrid() {
    board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
}

const dirMap = {
    H:  [1, 0],
    HR: [-1, 0],
    V:  [0, 1],
    VR: [0, -1],
    D:  [1, 1],
    DR: [-1, -1]
};

function placeWord(word) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
        attempts++;

        let dirKey = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
        let [dx, dy] = dirMap[dirKey];

        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);

        let ok = true;
        for (let i = 0; i < word.length; i++) {
            let nx = x + dx * i;
            let ny = y + dy * i;

            if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) {
                ok = false;
                break;
            }
            if (board[ny][nx] !== "" && board[ny][nx] !== word[i]) {
                ok = false;
                break;
            }
        }

        if (!ok) continue;

        for (let i = 0; i < word.length; i++) {
            let nx = x + dx * i;
            let ny = y + dy * i;
            board[ny][nx] = word[i];
        }

        placed = true;
    }
}

function fillRandomLetters() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (board[y][x] === "") {
                board[y][x] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function drawGrid() {
    grid.innerHTML = "";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const div = document.createElement("div");
            div.textContent = board[y][x];
            div.dataset.x = x;
            div.dataset.y = y;
            div.onclick = () => selectLetter(div);
            grid.appendChild(div);
        }
    }
}

function generateWordSearch() {
    createEmptyGrid();
    words.forEach(w => placeWord(w));
    fillRandomLetters();
    drawGrid();

    words.forEach(w => {
        let li = document.createElement("li");
        li.textContent = w;
        li.id = "word-" + w;
        wordList.appendChild(li);
    });
}

generateWordSearch();

// ======== SELECCIÓN DE LETRAS =====
function selectLetter(div) {
    let x = div.dataset.x;
    let y = div.dataset.y;
    let id = `${x},${y}`;

    if (selected.includes(id)) {
        selected = selected.filter(i => i !== id);
        div.classList.remove("selected");
        return;
    }

    selected.push(id);
    div.classList.add("selected");
    checkWord();
}

// ======== VERIFICACIÓN =====
function checkWord() {
    let formed = selected
        .map(i => {
            let [x, y] = i.split(",").map(Number);
            return board[y][x];
        })
        .join("");

    for (let w of words) {
        if (formed.includes(w)) {
            markAsFound(w);
            return;
        }
    }
}

// ==========================
//     MARCAR ENCONTRADA
// ==========================
function markAsFound(word) {
    if (foundWords.includes(word)) return;

    foundWords.push(word);

    // Pintar las letras seleccionadas de verde
    selected.forEach(i => {
        let [x, y] = i.split(",").map(Number);
        const index = y * gridSize + x; // índice en grid.children
        grid.children[index].classList.add("found");
        grid.children[index].classList.remove("selected"); // quitar amarillo
    });

    selected = [];

    // Pintar la palabra encontrada en la lista
    const li = document.getElementById("word-" + word);
    if (li) li.style.color = "#00cc44"; // verde bonito

    // Guardar palabra encontrada en localStorage
    let savedWords = JSON.parse(localStorage.getItem("foundWords") || "[]");
    if (!savedWords.includes(word)) {
        savedWords.push(word);
    }
    localStorage.setItem("foundWords", JSON.stringify(savedWords));
}


