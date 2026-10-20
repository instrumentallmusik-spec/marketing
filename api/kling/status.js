// Vercel Serverless Function: query a Kling image-to-video task.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido." });
  }
  const apiKey = process.env.KLING_API_KEY;
  const studioPassword = process.env.STUDIO_PASSWORD;
  if (!apiKey) return res.status(503).json({ error: "Falta configurar KLING_API_KEY en Vercel." });
  if (!studioPassword) return res.status(503).json({ error: "Falta configurar STUDIO_PASSWORD en Vercel." });
  const providedPassword = req.headers["x-studio-password"];
  if (typeof providedPassword !== "string" || providedPassword.length < 1 || providedPassword !== studioPassword) {
    return res.status(401).json({ error: "Contraseña del estudio incorrecta." });
  }
  const taskId = typeof req.query?.taskId === "string" ? req.query.taskId : "";
  if (!/^[A-Za-z0-9_-]{4,200}$/.test(taskId)) return res.status(400).json({ error: "Identificador de tarea no válido." });
  try {
    const response = await fetch("https://api-singapore.klingai.com/v1/videos/image2video/" + encodeURIComponent(taskId), {
      headers: { Authorization: "Bearer " + apiKey }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || (data.code !== undefined && data.code !== 0)) {
      return res.status(response.status >= 400 && response.status < 600 ? response.status : 502).json({
        error: data.message || "No se pudo consultar el estado en Kling."
      });
    }
    const task = data?.data || {};
    const status = task.task_status || task.status || "processing";
    const video = task?.task_result?.videos?.[0] || task?.task_result?.video || null;
    const videoUrl = typeof video?.url === "string" ? video.url : "";
    return res.status(200).json({
      taskId,
      status,
      videoUrl: status === "succeed" || status === "succeeded" ? videoUrl : "",
      message: task.task_status_msg || task.message || ""
    });
  } catch (error) {
    return res.status(502).json({ error: "No se pudo consultar Kling. Inténtalo de nuevo." });
  }
}
