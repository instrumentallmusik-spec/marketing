// Queue-based image-to-image generation for Igmaustral.
// Requires FAL_KEY and STUDIO_PASSWORD in Vercel. Never expose FAL_KEY to the browser.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }
  if (!process.env.FAL_KEY || !process.env.STUDIO_PASSWORD) {
    return res.status(503).json({ error: "Falta configurar FAL_KEY y STUDIO_PASSWORD en Vercel para Preview." });
  }
  if (typeof req.headers["x-studio-password"] !== "string" || req.headers["x-studio-password"] !== process.env.STUDIO_PASSWORD) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }
  const { imageData, prompt, costConfirmed } = req.body || {};
  if (costConfirmed !== true) return res.status(400).json({ error: "Confirma explícitamente el posible consumo de créditos antes de generar." });
  if (typeof imageData !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(imageData)) {
    return res.status(400).json({ error: "Sube una fotografía JPG, PNG o WebP válida." });
  }
  if (imageData.length > 3_800_000) {
    return res.status(413).json({ error: "La fotografía es demasiado grande. Prueba con una imagen más pequeña." });
  }
  const safePrompt = typeof prompt === "string" ? prompt.trim().slice(0, 1200) : "";
  if (safePrompt.length < 12) return res.status(400).json({ error: "Escribe una instrucción visual más detallada." });
  try {
    const response = await fetch("https://queue.fal.run/fal-ai/flux-1/dev/image-to-image", {
      method: "POST",
      headers: {
        Authorization: "Key " + process.env.FAL_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image_url: imageData,
        prompt: safePrompt,
        output_format: "jpeg",
        num_images: 1
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.request_id) {
      console.error("fal marketing image queue error", response.status, JSON.stringify(data).slice(0, 800));
      return res.status(response.status === 429 ? 429 : 502).json({ error: "No se pudo iniciar la generación. Revisa la configuración y el saldo del proveedor; no vuelvas a enviar la solicitud automáticamente." });
    }
    return res.status(202).json({
      requestId: data.request_id,
      status: "IN_QUEUE",
      model: "fal-ai/flux-1/dev/image-to-image",
      pricingNote: "Precio variable por resolución; consulta el precio vigente de fal.ai antes de cada generación."
    });
  } catch (error) {
    console.error("marketing image queue error", error);
    return res.status(500).json({ error: "No se pudo conectar con el generador. Comprueba el estado antes de volver a solicitar otra generación." });
  }
}
