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

// --- Новая структура меню и ссылки на HTML ---
const htmlLinks = {
  napravlenia: [
    { text: "Лечебное дело - 31.05.01", file: "Лечебка.html" },
    { text: "Педиатрия - 31.05.02", file: "Педиатрия.html" },
    { text: "Стоматология - 31.05.03", file: "Стомат.html" },
    { text: "Фармация - 33.05.01", file: "Фармация.html" },
    { text: "Медицинская биохимия - 30.05.01", file: "МБХ.html" },
    { text: "Клиническая психология - 37.05.01", file: "Клин.псих.html" },
  ],
  kcp: [
    { text: "В рамках контрольных цифр приёма", file: "КЦП.html" },
    { text: "На договорной основе", file: "КЦП_договор.html" },
  ],
  sroki: [
    { text: "Сроки приёма", file: "Сроки проведения приема.html" },
  ],
  info: [
    { text: "Индивидуальные достижения", file: "Учёт индивидуальных достижений.html" },
    { text: "Особые права при поступлении", file: "Особые права при поступлении.html" },
    { text: "Целевое обучение в вузах", file: "Целевое обучение в вузах.html" },
    { text: "Места приёма документов", file: "Места приема документов.html" },
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
  if (section === 'napravlenia' || section === 'kcp' || section === 'info') {
    html += '<div class="submenu">';
    htmlLinks[section].forEach(item => {
      html += `<button class="btn submenu-btn" onclick="openHTML('${item.file}', '${item.text}')">${item.text}</button>`;
    });
    html += '</div>';
    html += `<div class="controls">
      <button class="btn" onclick="goBack()">Назад</button>
      <button class="btn" onclick="goHome()">Главное меню</button>
    </div>`;
    document.getElementById('section-content').innerHTML = html;
  } else if (section === 'sroki') {
    openHTML('Сроки проведения приема.html', 'Сроки приёма');
  } else if (section === 'contacts') {
    openHTML('Контакты.html', 'Контакты');
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
  html += `<div class="iframe-back">
    <button class="btn" onclick="goBack()">Назад</button>
    <button class="btn" onclick="goHome()">Главное меню</button>
  </div>`;
  html += `<div class="iframe-container"><iframe src="${file}"></iframe></div>`;
  document.getElementById('section-content').innerHTML = html;
}

// --- Главная страница ---
window.addEventListener('DOMContentLoaded', () => {
  // Приветствие Telegram WebApp
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    document.getElementById('user-welcome').textContent = `${user.first_name} ${user.last_name || ''}, добро пожаловать!`;
  }
  showMainMenu();
  // Рендерим главное меню
  document.getElementById('main-menu').innerHTML = `
    <button class="btn menu-btn" onclick="openSection('napravlenia')">Направления подготовки</button>
    <button class="btn menu-btn" onclick="openSection('kcp')">Контрольные цифры приёма</button>
    <button class="btn menu-btn" onclick="openSection('sroki')">Сроки приёма</button>
    <button class="btn menu-btn" onclick="openSection('info')">Общая информация</button>
    <button class="btn menu-btn" onclick="openSection('contacts')">Контакты</button>
    <div class="menu-bottom"><a class="btn menu-btn" href="https://t.me/+S73kWaiJWKhmNmJi" target="_blank">Задать вопрос</a></div>
  `;
});

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