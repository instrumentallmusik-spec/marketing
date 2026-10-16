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
  if (imageData.length > 4_000_000) {
    return res.status(413).json({ error: "La imagen sigue siendo demasiado grande. Prueba con una foto más pequeña." });
  }
  try {
    const response = await fetch("https://fal.run/fal-ai/image-editing/background-change", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image_url: imageData,
        prompt: (typeof prompt === "string" && prompt.trim()) ? prompt.trim().slice(0, 1200) : "Realistic professional industrial workshop background, neutral lighting, preserve the original product appearance and composition.",
        output_format: "jpeg",
        safety_tolerance: "2"
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("fal image error", response.status, JSON.stringify(data).slice(0, 1000));
      return res.status(response.status === 429 ? 429 : 502).json({ error: "El servicio de imágenes no pudo completar la solicitud. Revisa tu saldo/API o intenta de nuevo." });
    }
    const url = data?.images?.[0]?.url;
    if (!url) return res.status(502).json({ error: "La API respondió sin una imagen. Intenta con otra foto." });
    return res.status(200).json({ url, model: "fal-ai/image-editing/background-change" });
  } catch (error) {
    console.error("generate-image error", error);
    return res.status(500).json({ error: "No se pudo conectar con el generador de imágenes." });
  }
}
