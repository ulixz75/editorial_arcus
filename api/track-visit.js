/**
 * ARCUS Editorial — API: registrar entrada de visitante
 * Vercel Serverless Function — debe estar en: api/track-visit.js (raíz del proyecto)
 * Variables de entorno necesarias en Vercel (Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 */
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en variables de entorno.");
    res.status(500).json({ error: "Configuración incompleta del servidor" });
    return;
  }

  try {
    const {
      isReturning,
      visitCount,
      page,
      url,
      source,
      device,
      geo,
      timestamp,
    } = req.body;

    // Capturar IP real del visitante desde los headers de Vercel
    const clientIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "Desconocida";

    const statusIcon = isReturning ? "🔁" : "🆕";
    const statusText = isReturning
      ? `Visitante recurrente (visita #${visitCount})`
      : "Visitante nuevo";

    const fecha = new Date(timestamp).toLocaleString("es-PR", {
      timeZone: "America/Puerto_Rico",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Usar la IP del servidor (más confiable) o la del cliente como fallback
    const displayIP = clientIP !== "Desconocida" ? clientIP : (geo?.ip || "N/D");

    const text =
      `${statusIcon} <b>${statusText}</b>\n\n` +
      `📄 <b>Página:</b> ${page}\n` +
      `🌎 <b>Ubicación:</b> ${geo?.city || "?"}, ${geo?.region || ""} — ${geo?.country || "?"}\n` +
      `🔗 <b>Origen:</b> ${source}\n` +
      `💻 <b>Dispositivo:</b> ${device}\n` +
      `🌐 <b>IP:</b> <code>${displayIP}</code>\n` +
      `🕐 <b>Hora de entrada:</b> ${fecha}\n` +
      `⏱ <b>Tiempo en página:</b> <i>calculando...</i>`;

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
        }),
      }
    );

    const tgData = await tgResponse.json();

    if (!tgData.ok) {
      console.error("Error de Telegram:", tgData.description);
      res.status(502).json({ error: "No se pudo enviar el mensaje a Telegram" });
      return;
    }

    res.status(200).json({ messageId: tgData.result.message_id });
  } catch (err) {
    console.error("Error en track-visit:", err);
    res.status(500).json({ error: "Error interno" });
  }
};
