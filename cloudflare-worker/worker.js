// Cloudflare Worker — принимает заявку с лендинга и шлёт её в Telegram.
// Токен бота и chat_id хранятся в переменных окружения воркера (Settings → Variables),
// в публичный код они НЕ попадают.
//
// Нужные переменные (Environment Variables / Secrets):
//   BOT_TOKEN  — токен бота от @BotFather, напр. 123456:AAH...
//   CHAT_ID    — id чата/канала, куда слать (свой Telegram id или id группы)
//   ALLOW_ORIGIN (необязательно) — домен сайта для CORS,
//                напр. https://vas4ek.github.io  (по умолчанию "*")

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: 'bad json' }, 400, cors);
    }

    // --- лёгкая серверная валидация, чтобы не слать мусор ---
    const name = String(data.name || '').trim().slice(0, 80);
    const phoneDigits = String(data.phone || '').replace(/\D/g, '');
    const goal = String(data.goal || '').trim().slice(0, 80);

    if (name.length < 2 || phoneDigits.length !== 11) {
      return json({ ok: false, error: 'validation' }, 422, cors);
    }

    const text =
      '🔥 Новая заявка с лендинга USMANOVAFIT\n\n' +
      '👤 Имя: ' + name + '\n' +
      '📞 Телефон: +' + phoneDigits + '\n' +
      '🎯 Цель: ' + (goal || '—');

    const tgRes = await fetch(
      'https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text,
          disable_web_page_preview: true,
        }),
      }
    );

    if (!tgRes.ok) {
      return json({ ok: false, error: 'telegram' }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
