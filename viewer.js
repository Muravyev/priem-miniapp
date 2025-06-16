// Получаем ссылку на PDF из параметра file
function getPDFUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('file');
}

function getTitle() {
  const params = new URLSearchParams(window.location.search);
  return params.get('title') || 'Просмотр PDF';
}

document.getElementById('title').textContent = getTitle();

// Кнопка назад
// Если Mini App открыт в Telegram, закрываем его, иначе возвращаемся назад
// ... existing code ...
document.getElementById('backBtn').onclick = function() {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.close();
  } else {
    window.history.back();
  }
};

// --- Данные для меню и PDF ---
const pdfData = {
  napravlenia: [
    { text: "Лечебное дело - 31.05.01", file: "Лечебка.pdf" },
    { text: "Педиатрия - 31.05.02", file: "Педиатрия.pdf" },
    { text: "Стоматология - 31.05.03", file: "Стомат.pdf" },
    { text: "Фармация - 33.05.01", file: "Фармация.pdf" },
    { text: "Медицинская биохимия - 30.05.01", file: "МБХ.pdf" },
    { text: "Клиническая психология - 37.05.01", file: "Клин.псих.pdf" },
  ],
  kcp: [
    { text: "В рамках контрольных цифр приёма", file: "В рамках КЦП.pdf" },
    { text: "На договорной основе", file: "На договорной основе.pdf" },
  ],
  sroki: [
    { text: "Сроки приёма", file: "Сроки приема.pdf" },
  ],
  id: [
    { text: "Виды индивидуальных достижений", file: "Виды ИД.pdf" },
    { text: "Учёт индивидуальных достижений", file: "Учёт ИД.pdf" },
    { text: "Условия и ограничения", file: "Условия и ограничения.pdf" },
  ],
  contacts: [
    { text: "Контакты", file: "Контакты.pdf" },
  ],
};

// --- Навигация ---
let navStack = [];

function openSection(section) {
  navStack.push(section);
  renderSection(section);
}

function goBack() {
  navStack.pop();
  if (navStack.length === 0) {
    showMainMenu();
  } else {
    renderSection(navStack[navStack.length - 1]);
  }
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
  if (pdfData[section]) {
    html += '<div class="submenu">';
    pdfData[section].forEach(item => {
      html += `<button class="btn submenu-btn" onclick="openPDF('${item.file}', '${item.text}')">${item.text}</button>`;
    });
    html += '</div>';
  }
  html += `<div class="controls">
    <button class="btn" onclick="goBack()">Назад</button>
    <button class="btn" onclick="goHome()">Главное меню</button>
  </div>`;
  document.getElementById('section-content').innerHTML = html;
}

function openPDF(file, title) {
  navStack.push({ pdf: file, title });
  renderPDF(file, title);
}

function renderPDF(file, title) {
  document.getElementById('main-menu').style.display = 'none';
  let html = `<h2 class="pdf-title">${title}</h2>`;
  html += `<div class="controls">
    <button class="btn" onclick="goBack()">Назад</button>
    <button class="btn" onclick="goHome()">Главное меню</button>
  </div>`;
  html += `<div id="pdf-viewer" class="pdf-viewer"></div>`;
  document.getElementById('section-content').innerHTML = html;
  loadPDF(file);
}

// --- PDF.js ---
let currentPdf = null;
let currentPage = 1;

function loadPDF(file) {
  const url = encodeURI(file);
  const container = document.getElementById('pdf-viewer');
  container.innerHTML = '';
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  pdfjsLib.getDocument(url).promise.then(function(pdf) {
    currentPdf = pdf;
    currentPage = 1;
    renderPage();
    addPageControls(container, pdf.numPages);
  }).catch(function(error) {
    container.innerHTML = '<p style="color:#b71c1c">Ошибка загрузки PDF: ' + error + '</p>';
  });
}

function renderPage() {
  const container = document.getElementById('pdf-viewer');
  container.querySelectorAll('canvas').forEach(c => c.remove());
  if (!currentPdf) return;
  currentPdf.getPage(currentPage).then(function(page) {
    // Масштаб под ширину экрана
    const desiredWidth = Math.min(window.innerWidth - 32, 800);
    const viewport = page.getViewport({ scale: 1 });
    const scale = desiredWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto 24px auto';
    container.insertBefore(canvas, container.firstChild);
    const context = canvas.getContext('2d');
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    page.render({ canvasContext: context, viewport: scaledViewport });
  });
}

function addPageControls(container, numPages) {
  let controls = document.createElement('div');
  controls.className = 'pdf-page-controls';
  controls.innerHTML = `
    <button class="btn" id="prevPage">←</button>
    <span id="pageInfo"></span>
    <button class="btn" id="nextPage">→</button>
  `;
  container.appendChild(controls);

  function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Стр. ${currentPage} из ${numPages}`;
  }
  updatePageInfo();

  document.getElementById('prevPage').onclick = function() {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      updatePageInfo();
    }
  };
  document.getElementById('nextPage').onclick = function() {
    if (currentPage < numPages) {
      currentPage++;
      renderPage();
      updatePageInfo();
    }
  };
}

// --- Telegram WebApp приветствие ---
window.addEventListener('DOMContentLoaded', () => {
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    document.getElementById('user-welcome').textContent = `${user.first_name} ${user.last_name || ''}, добро пожаловать!`;
  }
});

// --- Инициализация ---
showMainMenu(); 