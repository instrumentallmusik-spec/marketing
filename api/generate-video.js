export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Método no permitido." }); }
  if (!process.env.FAL_KEY || !process.env.STUDIO_PASSWORD) return res.status(503).json({ error: "Falta configurar FAL_KEY y STUDIO_PASSWORD en Vercel." });
  if (typeof req.headers["x-studio-password"] !== "string" || req.headers["x-studio-password"] !== process.env.STUDIO_PASSWORD) return res.status(401).json({ error: "Contraseña incorrecta." });
  const { imageData, prompt } = req.body || {};
  if (typeof imageData !== "string" || !imageData.startsWith("data:image/")) return res.status(400).json({ error: "Sube una fotografía JPG, PNG o WebP válida." });
  if (imageData.length > 4_000_000) return res.status(413).json({ error: "La imagen sigue siendo demasiado grande. Prueba con una foto más pequeña." });
  try {
    const response = await fetch("https://queue.fal.run/fal-ai/wan/v2.7/image-to-video", {
      method: "POST",
      headers: { Authorization: "Key " + process.env.FAL_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageData,
        prompt: (typeof prompt === "string" && prompt.trim()) ? prompt.trim().slice(0, 1200) : "A subtle slow camera push-in on the exact original industrial cleaning cloth. Preserve its color, weave, fibers, shape and proportions. Realistic workshop lighting, no redesign, no text, no logos.",
        duration: "5", resolution: "720p", aspect_ratio: "9:16"
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.request_id) {
      console.error("fal video queue error", response.status, JSON.stringify(data).slice(0, 1000));
      return res.status(response.status === 429 ? 429 : 502).json({ error: "No se pudo iniciar la generación del video. Revisa tu API/saldo o intenta de nuevo." });
    }
    return res.status(202).json({ requestId: data.request_id, status: "IN_QUEUE", model: "fal-ai/wan/v2.7/image-to-video" });
  } catch (error) {
    console.error("generate-video error", error);
    return res.status(500).json({ error: "No se pudo conectar con el generador de videos." });
  }
}
