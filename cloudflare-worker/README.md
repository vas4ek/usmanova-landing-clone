# Telegram-уведомления о заявках (Cloudflare Worker)

Воркер принимает POST с лендинга и шлёт заявку тебе в Telegram.
Токен бота **не хранится в коде сайта** — он лежит в переменных воркера.

## 1. Сделать бота и узнать chat_id
1. В Telegram напиши **@BotFather** → `/newbot` → получи **BOT_TOKEN** (вида `123456:AAH...`).
2. Напиши своему новому боту любое сообщение (например, «привет») — иначе он не сможет тебе писать.
3. Узнай свой **CHAT_ID**: напиши боту **@userinfobot** — он пришлёт твой numeric id.
   (Для группы — добавь бота в группу и возьми id группы, он с минусом.)

## 2. Создать воркер
1. Зайди на https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
2. Назови, например, `usmanova-lead`, нажми **Deploy** (создастся заготовка).
3. **Edit code** → удали весь код, вставь содержимое `worker.js` из этой папки → **Deploy**.

## 3. Прописать секреты
В воркере: **Settings → Variables and Secrets → Add**:
- `BOT_TOKEN` = токен от BotFather  (тип: Secret)
- `CHAT_ID`   = твой numeric id     (тип: Secret или Text)
- `ALLOW_ORIGIN` = `https://vas4ek.github.io`  (необязательно, для CORS)

Нажми **Deploy** ещё раз, чтобы переменные применились.

## 4. Подключить к сайту
1. Скопируй URL воркера — он вида `https://usmanova-lead.ВАШ-САБДОМЕН.workers.dev`.
2. Открой `index.html`, найди строку:
   ```js
   const WORKER_URL = 'https://PASTE-YOUR-WORKER.workers.dev';
   ```
   и вставь туда свой URL.
3. Закоммить и запушь — `git add index.html && git commit -m "wire worker url" && git push`.

## 5. Проверить
Отправь заявку на сайте → в Telegram должно прийти сообщение с именем, телефоном и целью.
Если не пришло — открой воркер → **Logs** (Real-time), там видно ошибку.
