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

// PDF.js
const url = getPDFUrl();
if (!url) {
  document.getElementById('pdf-viewer').innerHTML = '<p style="color:#b71c1c">Ошибка: не передан файл PDF.</p>';
} else {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';

  const container = document.getElementById('pdf-viewer');
  pdfjsLib.getDocument(url).promise.then(function(pdf) {
    // Отобразим первую страницу
    pdf.getPage(1).then(function(page) {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: context, viewport: viewport });
    });
  }).catch(function(error) {
    container.innerHTML = '<p style="color:#b71c1c">Ошибка загрузки PDF: ' + error + '</p>';
  });
} 