const textarea = document.getElementById("text");
const counter = document.getElementById("num");

textarea.addEventListener("input", () => {
    counter.textContent = textarea.value.length;
});
