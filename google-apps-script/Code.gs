/**
 * Google Apps Script — приём заявок с лендинга USMANOVAFIT в Google Таблицу.
 * Каждая отправка формы добавляет новую строку: Дата | Имя | Телефон | Цель.
 *
 * Как развернуть — см. README.md в этой папке.
 */

// ID твоей таблицы (из ссылки .../spreadsheets/d/<ВОТ_ЭТО>/edit)
var SHEET_ID = '12BiKz-YwWOxfKNZo91rL1DLo3QjuXsJezY-DTGXHuEg';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // honeypot: бот заполнил скрытое поле — молча игнорируем
    if (data.company) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // серверная валидация — отсекаем мусор/прямой спам
    var name = String(data.name || '').trim().slice(0, 80);
    var digits = String(data.phone || '').replace(/\D/g, '');
    var goal = String(data.goal || '').trim().slice(0, 80);
    if (name.length < 2 || digits.length < 10 || digits.length > 15) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'validation' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Заявки') || ss.getSheets()[0];

    // заголовки при первом запуске
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата', 'Имя', 'Телефон', 'Цель']);
    }

    // телефон приходит с фронтенда уже с апострофом ('+7...) — Таблицы хранят как текст
    sheet.appendRow([new Date(), name, data.phone || '', goal]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Открыть в браузере URL /exec — проверка, что web-app живой.
function doGet() {
  return ContentService.createTextOutput('USMANOVAFIT lead endpoint is live');
}
