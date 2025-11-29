// Cambiar modo claro/oscuro
function toggleTheme() {
    document.body.classList.toggle("dark");
    let mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    updateThemeIcon();
}

// Cambiar icono sol/luna
function updateThemeIcon() {
    const icon = document.querySelector("#themeToggleBtn #themeIcon");
    if (!icon) return;
    icon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// Aplicar modo guardado
window.onload = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
    updateThemeIcon();
};

// Guardar nivel y abrir juego
function startGame(level) {
    localStorage.setItem("nivel", level);
    window.location.href = "index.html";
}
