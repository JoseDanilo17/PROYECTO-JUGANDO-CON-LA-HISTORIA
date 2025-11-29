// ===== CAMBIO DE TEMA =====
function toggleTheme() {
    document.body.classList.toggle("dark");

    let mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);

    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById("themeIcon");
    if (!icon) return;
    icon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

window.onload = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
    }
    updateThemeIcon();
};

// Guardar nivel y cargar juego
function startGame(level) {
    localStorage.setItem("nivel", level);
    window.location.href = "index.html";
}

// ======== PERFIL ========
const profileBtn = document.getElementById("profileBtn");
const profileModal = document.getElementById("profileModal");
const closeModal = document.getElementById("closeModal");
const totalFoundWordsCount = document.getElementById("totalFoundWordsCount");
const totalFoundWordsList = document.getElementById("totalFoundWordsList");
const resetProgressBtn = document.getElementById("resetProgressBtn");

profileBtn.onclick = () => {
    profileModal.style.display = "block";
    updateProfileStats();
};

closeModal.onclick = () => profileModal.style.display = "none";

window.onclick = (e) => {
    if (e.target === profileModal) profileModal.style.display = "none";
};

function updateProfileStats() {
    const totalFound = JSON.parse(localStorage.getItem("totalFoundWords") || "[]");
    totalFoundWordsCount.textContent = totalFound.length;

    totalFoundWordsList.innerHTML = "";
    totalFound.forEach(w => {
        const li = document.createElement("li");
        li.textContent = w;
        totalFoundWordsList.appendChild(li);
    });
}

resetProgressBtn.onclick = () => {
    if(confirm("¿Seguro que quieres reiniciar todo tu progreso?")) {
        localStorage.removeItem("totalFoundWords");
        updateProfileStats();
    }
};
