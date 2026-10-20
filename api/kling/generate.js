// Vercel Serverless Function: Kling image-to-video generation.
// KLING_API_KEY and STUDIO_PASSWORD must be configured in Vercel.
// This endpoint intentionally uses the legacy API because it accepts raw base64 images.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }
  const apiKey = process.env.KLING_API_KEY;
  const studioPassword = process.env.STUDIO_PASSWORD;
  if (!apiKey) return res.status(503).json({ error: "Falta configurar KLING_API_KEY en Vercel." });
  if (!studioPassword) return res.status(503).json({ error: "Falta configurar STUDIO_PASSWORD en Vercel para proteger las generaciones." });
  const providedPassword = req.headers["x-studio-password"];
  if (typeof providedPassword !== "string" || providedPassword.length < 1 || providedPassword !== studioPassword) {
    return res.status(401).json({ error: "Contraseña del estudio incorrecta." });
  }
  try {
    const body = req.body || {};
    const image = typeof body.image === "string" ? body.image : "";
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const duration = String(body.duration || "5");
    if (!image || image.length > 14_000_000) return res.status(400).json({ error: "La imagen falta o supera el límite permitido. Usa una imagen JPG o PNG de menos de 10 MB." });
    if (!/^(?:[A-Za-z0-9+/]+={0,2})$/.test(image)) return res.status(400).json({ error: "La imagen no tiene un formato Base64 válido." });
    if (!prompt || prompt.length > 2000) return res.status(400).json({ error: "Escribe una instrucción de entre 1 y 2000 caracteres." });
    if (!["5", "10"].includes(duration)) return res.status(400).json({ error: "Duración no válida." });

    const response = await fetch("https://api-singapore.klingai.com/v1/videos/image2video", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: "kling-v2-5-turbo",
        image,
        prompt,
        negative_prompt: "do not change the product's color, texture, shape, material, or packaging; no extra products, no text, no logos, no warped objects, no unrealistic hands",
        duration,
        mode: "std",
        sound: "off",
        callback_url: "",
        external_task_id: ""
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || (data.code !== undefined && data.code !== 0)) {
      // Never return provider headers or secrets to the browser.
      return res.status(response.status >= 400 && response.status < 600 ? response.status : 502).json({
        error: data.message || "Kling no aceptó la solicitud. Revisa los créditos y el estado de tu API en la consola de Kling."
      });
    }
    const taskId = data?.data?.task_id || data?.data?.id;
    if (!taskId) return res.status(502).json({ error: "Kling respondió sin un identificador de tarea." });
    return res.status(202).json({ taskId, status: data?.data?.task_status || "submitted" });
  } catch (error) {
    return res.status(502).json({ error: "No se pudo contactar a Kling. Inténtalo más tarde." });
  }
}
