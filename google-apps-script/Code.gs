/**
 * Google Apps Script — приём заявок с лендинга USMANOVAFIT в Google Таблицу.
 * Каждая отправка формы добавляет новую строку: Дата | Имя | Телефон | Цель.
 *
 * Как развернуть — см. README.md в этой папке.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Заявки') || ss.getSheets()[0];

    // заголовки при первом запуске
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата', 'Имя', 'Телефон', 'Цель']);
    }

    sheet.appendRow([
      new Date(),
      data.name  || '',
      data.phone || '',
      data.goal  || ''
    ]);

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
