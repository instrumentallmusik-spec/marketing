// Polls the fal.ai queue for an existing image request. Does not start a new generation.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido." });
  }
  if (!process.env.FAL_KEY || !process.env.STUDIO_PASSWORD) {
    return res.status(503).json({ error: "Falta configurar FAL_KEY y STUDIO_PASSWORD en Vercel para Preview." });
  }
  if (typeof req.headers["x-studio-password"] !== "string" || req.headers["x-studio-password"] !== process.env.STUDIO_PASSWORD) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }
  const requestId = typeof req.query?.requestId === "string" ? req.query.requestId : "";
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(requestId)) {
    return res.status(400).json({ error: "Identificador de solicitud inválido." });
  }
  const base = "https://queue.fal.run/fal-ai/flux-1/dev/image-to-image/requests/" + encodeURIComponent(requestId);
  const headers = { Authorization: "Key " + process.env.FAL_KEY };
  try {
    const statusResponse = await fetch(base + "/status", { headers });
    const statusData = await statusResponse.json().catch(() => ({}));
    if (!statusResponse.ok) return res.status(502).json({ error: "No se pudo consultar el estado de la imagen." });
    if (statusData.status === "FAILED") {
      return res.status(502).json({ status: "FAILED", error: "El proveedor no pudo generar la imagen. Revisa el panel del proveedor antes de repetir la solicitud." });
    }
    if (statusData.status !== "COMPLETED") {
      return res.status(200).json({ status: statusData.status || "IN_PROGRESS" });
    }
    const resultResponse = await fetch(base, { headers });
    const resultData = await resultResponse.json().catch(() => ({}));
    if (!resultResponse.ok) return res.status(502).json({ error: "La imagen terminó, pero no se pudo recuperar el resultado." });
    const image = resultData?.images?.[0];
    if (!image?.url) return res.status(502).json({ error: "El proveedor terminó sin devolver una imagen." });
    return res.status(200).json({
      status: "COMPLETED",
      url: image.url,
      width: image.width || null,
      height: image.height || null,
      model: "fal-ai/flux-1/dev/image-to-image"
    });
  } catch (error) {
    console.error("marketing image status error", error);
    return res.status(500).json({ error: "No se pudo consultar el estado. No vuelvas a generar sin revisar primero la solicitud anterior." });
  }
}
