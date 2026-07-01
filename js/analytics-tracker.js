/**
 * ARCUS Editorial — Analytics Tracker
 * Captura datos de tráfico y los envía a /api/track-visit (Telegram).
 * Incluir en index.html justo antes de </body>:
 *   <script src="js/analytics-tracker.js" defer></script>
 */
(function () {
  "use strict";

  const VISITOR_KEY = "arcus_visitor_id";
  const VISITS_COUNT_KEY = "arcus_visits_count";
  const SESSION_TRACKED_KEY = "arcus_session_tracked";

  // --- 1. Identificar visitante (nuevo vs. recurrente) ---
  function getOrCreateVisitorId() {
    try {
      let id = localStorage.getItem(VISITOR_KEY);
      let isReturning = true;
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(VISITOR_KEY, id);
        isReturning = false;
      }
      const prevCount = parseInt(localStorage.getItem(VISITS_COUNT_KEY) || "0", 10);
      localStorage.setItem(VISITS_COUNT_KEY, String(prevCount + 1));
      return { id, isReturning, visitCount: prevCount + 1 };
    } catch (e) {
      // localStorage puede fallar en incógnito (Safari antiguo) o con storage lleno
      return { id: "anonymous-" + Date.now(), isReturning: false, visitCount: 1 };
    }
  }

  // --- 2. Detectar fuente de tráfico (UTM o referrer) ---
  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    if (utmSource) {
      return `UTM: ${utmSource}${utmMedium ? " / " + utmMedium : ""}${utmCampaign ? " / " + utmCampaign : ""}`;
    }
    if (document.referrer) {
      try {
        const refHost = new URL(document.referrer).hostname;
        if (refHost && refHost !== window.location.hostname) return refHost;
      } catch (e) {}
    }
    return "Directo (sin referrer)";
  }

  // --- 3. Detectar dispositivo/navegador de forma simple ---
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = "Desktop";
    if (/Mobi|Android/i.test(ua)) device = "Móvil";
    else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

    let browser = "Otro";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    return `${device} · ${browser}`;
  }

  // --- 4. Geolocalización aproximada por IP (gratis, sin key) ---
  async function getGeoData() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("geo fetch failed");
      const data = await res.json();
      return {
        city: data.city || "Desconocida",
        region: data.region || "",
        country: data.country_name || "Desconocido",
        ip: data.ip || "N/D",
      };
    } catch (e) {
      return { city: "Desconocida", region: "", country: "Desconocido", ip: "N/D" };
    }
  }

  // --- 5. Enviar evento de ENTRADA ---
  async function trackVisitStart() {
    // Solo evita doble tracking dentro de la MISMA pestaña (no entre pestañas)
    try {
      if (sessionStorage.getItem(SESSION_TRACKED_KEY)) return;
    } catch (e) {
      // sessionStorage puede fallar — continuar de todas formas
    }

    const visitor = getOrCreateVisitorId();
    const geo = await getGeoData();

    const payload = {
      visitorId: visitor.id,
      isReturning: visitor.isReturning,
      visitCount: visitor.visitCount,
      page: window.location.pathname,
      url: window.location.href,
      source: getTrafficSource(),
      device: getDeviceInfo(),
      geo,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.messageId) {
        try {
          sessionStorage.setItem(SESSION_TRACKED_KEY, "1");
          sessionStorage.setItem("arcus_telegram_msg_id", String(data.messageId));
          sessionStorage.setItem("arcus_visit_start", String(Date.now()));
        } catch (e) {
          // sessionStorage puede fallar en incógnito — no es crítico
        }
      }
    } catch (e) {
      console.warn("Analytics tracker: no se pudo registrar la visita.", e);
    }
  }

  // --- 6. Enviar evento de SALIDA (duración de la visita) ---
  function trackVisitEnd() {
    try {
      const messageId = sessionStorage.getItem("arcus_telegram_msg_id");
      const startTime = sessionStorage.getItem("arcus_visit_start");
      if (!messageId || !startTime) return;

      const durationSeconds = Math.round((Date.now() - parseInt(startTime, 10)) / 1000);

      const payload = JSON.stringify({
        messageId: parseInt(messageId, 10),
        durationSeconds,
      });

      // sendBeacon garantiza el envío aunque la pestaña se esté cerrando
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track-visit-end", blob);
    } catch (e) {
      // Falla silenciosa
    }
  }

  // --- Inicialización ---
  if (document.readyState === "complete" || document.readyState === "interactive") {
    trackVisitStart();
  } else {
    document.addEventListener("DOMContentLoaded", trackVisitStart);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") trackVisitEnd();
  });
  window.addEventListener("pagehide", trackVisitEnd);
})();
