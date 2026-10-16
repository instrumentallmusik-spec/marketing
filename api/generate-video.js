export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }
  if (!process.env.FAL_KEY || !process.env.STUDIO_PASSWORD) {
    return res.status(503).json({ error: "Falta configurar FAL_KEY y STUDIO_PASSWORD en las variables de entorno de Vercel." });
  }
  const password = req.headers["x-studio-password"];
  if (typeof password !== "string" || password !== process.env.STUDIO_PASSWORD) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }
  const { imageData, prompt } = req.body || {};
  if (typeof imageData !== "string" || !imageData.startsWith("data:image/")) {
    return res.status(400).json({ error: "Sube una fotografía JPG, PNG o WebP válida." });
  }
  if (imageData.length > 5_500_000) {
    return res.status(413).json({ error: "La imagen sigue siendo demasiado grande. Prueba con una foto más pequeña." });
  }
  try {
    const response = await fetch("https://fal.run/fal-ai/wan/v2.7/image-to-video", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image_url: imageData,
        prompt: (typeof prompt === "string" && prompt.trim()) ? prompt.trim().slice(0, 1200) : "A subtle slow camera push-in on the exact original industrial cleaning cloth. Preserve the product's color, weave, fibers, shape and proportions. Realistic workshop lighting, no redesign, no text, no logos.",
        duration: "5",
        resolution: "720p",
        aspect_ratio: "9:16"
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("fal video error", response.status, JSON.stringify(data).slice(0, 1000));
      return res.status(response.status === 429 ? 429 : 502).json({ error: "El servicio de video no pudo completar la solicitud. Revisa el modelo, saldo/API o intenta de nuevo." });
    }
    const url = data?.video?.url || data?.videos?.[0]?.url;
    if (!url) {
      console.error("fal video missing url", JSON.stringify(data).slice(0, 1000));
      return res.status(502).json({ error: "La API no devolvió un video terminado. Intenta nuevamente; algunos modelos requieren procesamiento en cola." });
    }
    return res.status(200).json({ url, model: "fal-ai/wan/v2.7/image-to-video" });
  } catch (error) {
    console.error("generate-video error", error);
    return res.status(500).json({ error: "No se pudo conectar con el generador de videos." });
  }
}
