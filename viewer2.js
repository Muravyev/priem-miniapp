<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Приёмная комиссия СГМУ — Mini App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
  <div class="header">
    <img src="logo.png" alt="Логотип СГМУ" class="logo">
    <div id="user-welcome" style="color:#000; font-size:18px; text-align:center; font-weight:600; margin-bottom: 12px;"></div>
  </div>

  <div id="main-menu" class="menu">
    <button class="btn menu-btn" onclick="openSection('napravlenia')">Специальности</button>
    <button class="btn menu-btn" onclick="openSection('kcp')">Контрольные цифры приёма</button>
    <button class="btn menu-btn" onclick="openSection('sroki')">Сроки приёма</button>
    <button class="btn menu-btn" onclick="openSection('info')">Общая информация</button>
    <button class="btn menu-btn" onclick="openSection('contacts')">Контакты</button>
    <div class="menu-bottom" style="display: flex; justify-content: center;">
      <a class="btn menu-btn" href="https://t.me/+S73kWaiJWKhmNmJi" target="_blank" style="text-align:center;">Задать вопрос</a>
    </div>
  </div>

  <div id="section-content"></div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      const userBlock = document.getElementById('user-welcome');
      if (Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        userBlock.textContent = `${user.first_name} ${user.last_name || ''}, добро пожаловать в мини-приложение приёмной комиссии СГМУ!`;
      } else {
        userBlock.textContent = `Добро пожаловать в мини-приложение приёмной комиссии СГМУ!`;
      }
    });
  </script>

  <script src="viewer2.js"></script>
</body>
</html>
