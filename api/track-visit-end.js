/**
 * ARCUS Editorial — API: registrar salida del visitante (duración)
 * Vercel Serverless Function — debe estar en: api/track-visit-end.js (raíz del proyecto)
 * Usa las mismas variables de entorno: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    res.status(500).json({ error: "Configuración incompleta del servidor" });
    return;
  }

  try {
    // sendBeacon envía el body como Blob; Vercel lo parsea igual si es JSON válido
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    const { messageId, durationSeconds } = body;
    if (!messageId || durationSeconds == null) {
      res.status(400).json({ error: "Datos incompletos" });
      return;
    }

    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const duracionTexto =
      minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Telegram no permite "leer" el texto de un mensaje ya enviado por el bot,
    // y no estamos guardando el texto original en ningún lado (solo Telegram, sin BD).
    // Por eso, en vez de editar el mensaje, respondemos al mensaje original con la duración:
    // queda agrupado visualmente como hilo de la misma visita.
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `⏱ <b>Tiempo en página:</b> ${duracionTexto}`,
        parse_mode: "HTML",
        reply_to_message_id: messageId,
      }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error en track-visit-end:", err);
    res.status(500).json({ error: "Error interno" });
  }
};
