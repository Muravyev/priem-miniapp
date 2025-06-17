function loadPage(filename) {
  fetch(filename)
    .then(response => response.text())
    .then(data => {
      document.getElementById("content").innerHTML = data;
      document.getElementById("content").style.display = "block";
      document.getElementById("main-buttons").style.display = "none";
      document.getElementById("nav").style.display = "block";
    });
}
function goBack() {
  document.getElementById("content").style.display = "none";
  document.getElementById("main-buttons").style.display = "block";
  document.getElementById("nav").style.display = "none";
}
function goHome() {
  goBack();
}
window.addEventListener("DOMContentLoaded", function() {
  if (Telegram.WebApp?.initDataUnsafe?.user?.first_name) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    document.getElementById("welcome-text").innerText = `${user.first_name}, добро пожаловать в мини-приложение приёмной комиссии СГМУ!`;
  }
});