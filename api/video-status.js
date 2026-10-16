export default async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Método no permitido." }); }
  if (!process.env.FAL_KEY || !process.env.STUDIO_PASSWORD) return res.status(503).json({ error: "Falta configurar FAL_KEY y STUDIO_PASSWORD en Vercel." });
  if (typeof req.headers["x-studio-password"] !== "string" || req.headers["x-studio-password"] !== process.env.STUDIO_PASSWORD) return res.status(401).json({ error: "Contraseña incorrecta." });
  const requestId = typeof req.query?.requestId === "string" ? req.query.requestId : "";
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(requestId)) return res.status(400).json({ error: "Identificador de generación inválido." });
  const base = "https://queue.fal.run/fal-ai/wan/v2.7/image-to-video/requests/" + encodeURIComponent(requestId);
  const headers = { Authorization: "Key " + process.env.FAL_KEY };
  try {
    const statusResponse = await fetch(base + "/status", { headers });
    const statusData = await statusResponse.json().catch(() => ({}));
    if (!statusResponse.ok) return res.status(502).json({ error: "No se pudo consultar el estado del video." });
    if (statusData.status !== "COMPLETED") {
      if (statusData.status === "FAILED") return res.status(502).json({ error: "El proveedor no pudo generar el video. Prueba con otra fotografía o instrucción." });
      return res.status(200).json({ status: statusData.status || "IN_PROGRESS" });
    }
    const resultResponse = await fetch(base, { headers });
    const resultData = await resultResponse.json().catch(() => ({}));
    if (!resultResponse.ok) return res.status(502).json({ error: "El video terminó, pero no se pudo recuperar el archivo." });
    const url = resultData?.video?.url || resultData?.videos?.[0]?.url;
    if (!url) return res.status(502).json({ error: "El proveedor terminó sin devolver un enlace de video." });
    return res.status(200).json({ status: "COMPLETED", url });
  } catch (error) {
    console.error("video-status error", error);
    return res.status(500).json({ error: "No se pudo consultar el estado de la generación." });
  }
}
