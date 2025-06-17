document.addEventListener('DOMContentLoaded', function () {
  const sectionContent = document.getElementById('section-content');
  const mainMenu = document.getElementById('main-menu');

  const GITHUB_BASE = "https://muravyev.github.io/priem-miniapp/";
  const sections = [
    { text: "Специальности", file: GITHUB_BASE + "napravlenia.html" },
    { text: "Контрольные цифры приёма", file: GITHUB_BASE + "KCP.html" },
    { text: "Сроки приёма", file: GITHUB_BASE + "Sroki_provedenia_priema_v_2025_godu.html" },
    { text: "Общая информация", file: GITHUB_BASE + "info.html" },
    { text: "Контакты", file: GITHUB_BASE + "Kontakty.html" },
    { text: "Индивидуальные достижения", file: GITHUB_BASE + "Uchet_individualnykh_dostizheniy.html" },
    { text: "Целевое обучение", file: GITHUB_BASE + "Celevoe_obuchenie.html" },
    { text: "Особые права", file: GITHUB_BASE + "Osobye_prava.html" },
    { text: "Личный кабинет", file: GITHUB_BASE + "Lichny_kabinet.html" },
    { text: "Платное обучение", file: GITHUB_BASE + "Platnoe_obuchenie.html" }
  ];

  window.openSection = function (section) {
    const found = sections.find(s => s.file.toLowerCase().includes(section));
    if (found) {
      fetch(found.file)
        .then(res => res.text())
        .then(html => {
          sectionContent.innerHTML = `
            <div class="top-nav">
              <button class="btn back-btn" onclick="goBack()">← Назад</button>
              <button class="btn home-btn" onclick="goHome()">🏠 Главное меню</button>
            </div>
            <div class="section">${html}</div>
          `;
          mainMenu.style.display = 'none';
        });
    }
  };

  window.goBack = function () {
    sectionContent.innerHTML = '';
    mainMenu.style.display = 'block';
  };

  window.goHome = function () {
    sectionContent.innerHTML = '';
    mainMenu.style.display = 'block';
  };

  const welcomeBlock = document.getElementById('user-welcome');
  if (Telegram.WebApp?.initDataUnsafe?.user) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    welcomeBlock.innerHTML = `<span style="color:#000;">${user.first_name} ${user.last_name || ''}, добро пожаловать в мини-приложение приёмной комиссии СГМУ!</span>`;
  } else {
    welcomeBlock.innerHTML = `<span style="color:#000;">Добро пожаловать в мини-приложение приёмной комиссии СГМУ!</span>`;
  }
});
