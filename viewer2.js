document.addEventListener('DOMContentLoaded', function () {
  const sectionContent = document.getElementById('section-content');
  const mainMenu = document.getElementById('main-menu');
  const submenu = document.getElementById('submenu');

  // --- Структура меню и подменю ---
  const RAW = 'https://raw.githubusercontent.com/Muravyev/priem-miniapp/refs/heads/main/';
  const menu = {
    napravlenia: {
      title: 'Направления подготовки',
      items: [
        { text: 'Лечебное дело - 31.05.01', file: RAW + 'Лечебка.html' },
        { text: 'Педиатрия - 31.05.02', file: RAW + 'Педиатрия.html' },
        { text: 'Стоматология - 31.05.03', file: RAW + 'Стомат.html' },
        { text: 'Фармация - 33.05.01', file: RAW + 'Фармация.html' },
        { text: 'Медицинская биохимия - 30.05.01', file: RAW + 'МБХ.html' },
        { text: 'Клиническая психология - 37.05.01', file: RAW + 'Клин.псих.html' },
      ]
    },
    kcp: {
      title: 'Контрольные цифры приёма',
      items: [
        { text: 'В рамках контрольных цифр приёма', file: RAW + 'КЦП.html' },
        { text: 'На договорной основе', file: RAW + 'КЦП_договор.html' },
      ]
    },
    sroki: {
      file: RAW + 'Сроки%20проведения%20приема.html'
    },
    faq: {
      title: 'Общие вопросы',
      items: [
        { text: 'Индивидуальные достижения', file: RAW + 'Учет%20индивидуальных%20достижении.html' },
        { text: 'Целевое обучение в вузах', file: RAW + 'Целевое%20обучение.html' },
        { text: 'Особые права при поступлении', file: RAW + 'Особые%20права%20при%20поступлении.html' },
      ]
    },
    contacts: {
      file: RAW + '%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D1%8B.html'
    }
  };

  window.openSection = function (key) {
    sectionContent.innerHTML = '';
    submenu.innerHTML = '';
    mainMenu.style.display = 'none';
    if (menu[key]?.items) {
      // Показываем подменю
      submenu.innerHTML = `<div class="submenu"><h2 style='text-align:center;'>${menu[key].title}</h2></div>`;
      menu[key].items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'btn submenu-btn';
        btn.textContent = item.text;
        btn.onclick = () => loadHtml(item.file, item.text);
        submenu.appendChild(btn);
      });
      // Кнопка назад
      const backBtn = document.createElement('button');
      backBtn.className = 'btn back-btn';
      backBtn.textContent = '← Назад';
      backBtn.onclick = goHome;
      submenu.appendChild(backBtn);
    } else if (menu[key]?.file) {
      // Просто HTML-файл
      loadHtml(menu[key].file);
    }
  };

  function loadHtml(url, title) {
    submenu.innerHTML = '';
    fetch(url)
      .then(res => res.text())
      .then(html => {
        sectionContent.innerHTML = `
          <div class="top-nav">
            <button class="btn back-btn" onclick="goHome()">← Назад</button>
          </div>
          <div class="section">
            ${title ? `<h2 class='pdf-title'>${title}</h2>` : ''}
            ${html}
          </div>
        `;
      });
  }

  window.goHome = function () {
    sectionContent.innerHTML = '';
    submenu.innerHTML = '';
    mainMenu.style.display = 'block';
  };

  // Приветствие
  const welcomeBlock = document.getElementById('user-welcome');
  if (Telegram.WebApp?.initDataUnsafe?.user) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    welcomeBlock.innerHTML = `<span style="color:#000;">${user.first_name} ${user.last_name || ''}, добро пожаловать в мини-приложение приёмной комиссии СГМУ!</span>`;
  } else {
    welcomeBlock.innerHTML = `<span style="color:#000;">Добро пожаловать в мини-приложение приёмной комиссии СГМУ!</span>`;
  }
});
