// Получаем ссылку на PDF из параметра file
function getPDFUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('file');
}

// Получаем заголовок (для iframe)
function getTitle() {
  const params = new URLSearchParams(window.location.search);
  return params.get('title') || '';
}

// Структура меню и ссылки на HTML (файлы на русском)
const htmlLinks = {
  napravlenia: [
    { text: "Лечебное дело - 31.05.01", file: "Лечебка.html" },
    { text: "Педиатрия - 31.05.02",    file: "Педиатрия.html" },
    { text: "Стоматология - 31.05.03", file: "Стоматология.html" },
    { text: "Фармация - 33.05.01",      file: "Фармация.html" },
    { text: "Медицинская биохимия - 30.05.01", file: "Медицинская биохимия.html" },
    { text: "Клиническая психология - 37.05.01", file: "Клиническая психология.html" },
  ],
  kcp: [
    { text: "В рамках контрольных цифр приёма", file: "КЦП.html" },
    { text: "На договорной основе",            file: "КЦП_договор.html" },
  ],
  sroki: [
    { text: "Сроки приёма", file: "Сроки проведения приема.html" },
  ],
  info: [
    { text: "Индивидуальные достижения",       file: "Учёт индивидуальных достижений.html" },
    { text: "Особые права при поступлении",    file: "Особые права при поступлении.html" },
    { text: "Целевое обучение в вузах",       file: "Целевое обучение.html" },
    { text: "Места приёма документов",        file: "Места приема документов.html" },
  ],
  contacts: [
    { text: "Контакты", file: "Контакты.html" },
  ],
};

let navStack = [];

function openSection(section) {
  navStack.push(section);
  renderSection(section);
}

function goBack() {
  navStack.pop();
  if (!navStack.length) showMainMenu();
  else renderSection(navStack[navStack.length - 1]);
}

function goHome() {
  navStack = [];
  showMainMenu();
}

function showMainMenu() {
  document.getElementById('main-menu').style.display = '';
  document.getElementById('section-content').innerHTML = '';
}

function renderSection(section) {
  document.getElementById('main-menu').style.display = 'none';
  let html = '';
  if (['napravlenia','kcp','info'].includes(section)) {
    html += '<div class="submenu">';
    htmlLinks[section].forEach(item => {
      html += `<button class="btn submenu-btn" onclick="openHTML('${item.file}','${item.text}')">${item.text}</button>`;
    });
    html += '</div>';
    html += `
      <div class="controls">
        <button class="btn" onclick="goBack()">← Назад</button>
        <button class="btn" onclick="goHome()">Главное меню</button>
      </div>`;
    document.getElementById('section-content').innerHTML = html;
  } else if (section === 'sroki') {
    openHTML('Сроки проведения приема.html','Сроки приёма');
  } else if (section === 'contacts') {
    openHTML('Контакты.html','Контакты');
  }
}

function openHTML(file, title) {
  navStack.push({ html: file, title });
  renderHTML(file, title);
}

function renderHTML(file, title) {
  document.getElementById('main-menu').style.display = 'none';
  let html = '';
  if (title) {
    html += `<h2 class="pdf-title">${title}</h2>`;
  }
  html += `
    <div class="iframe-back">
      <button class="btn" onclick="goBack()">← Назад</button>
      <button class="btn" onclick="goHome()">Главное меню</button>
    </div>
    <div class="iframe-container">
      <iframe src="${file}?title=${encodeURIComponent(title)}"></iframe>
    </div>`;
  document.getElementById('section-content').innerHTML = html;
}

// Инициализация главного меню
window.addEventListener('DOMContentLoaded', () => {
  if (Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    document.getElementById('user-welcome').textContent =
      `${user.first_name} ${user.last_name||''}, добро пожаловать!`;
  }
  showMainMenu();
  document.getElementById('main-menu').innerHTML = `
    <button class="btn menu-btn" onclick="openSection('napravlenia')">Специальности</button>
    <button class="btn menu-btn" onclick="openSection('kcp')">Контрольные цифры приёма</button>
    <button class="btn menu-btn" onclick="openSection('sroki')">Сроки приёма</button>
    <button class="btn menu-btn" onclick="openSection('info')">Общая информация</button>
    <button class="btn menu-btn" onclick="openSection('contacts')">Контакты</button>
    <div class="menu-bottom" style="justify-content:center;">
      <a class="btn menu-btn" href="https://t.me/+S73kWaiJWKhmNmJi" target="_blank">Задать вопрос</a>
    </div>`;
});
