# Estudio de video de Igmaustral

## Modos disponibles
- **Montaje local:** guiones editables y video desde una foto con movimiento de cámara, marca, texto y audio. Se ejecuta en el navegador y no usa API de generación.
- **Kling IA:** modo opcional de imagen a video que envía la foto al proveedor para generar movimiento y contexto visual. La IA puede alterar detalles del producto; revisar el resultado antes de publicar.

## Montaje local
- Ofrece formatos vertical 9:16, cuadrado 1:1 y horizontal 16:9.
- Exporta WebM con pista de audio usando MediaRecorder cuando el navegador lo soporta.
- Incluye conversión opcional de WebM a MP4 en el navegador mediante FFmpeg.wasm; descarga librerías desde CDN, sin API de generación de pago.
- Permite cargar música o voz en off propia; si no se carga audio, añade una base sonora sencilla generada localmente.
- No guarda imágenes en el servidor ni publica contenido automáticamente.

## Kling IA: configuración requerida
Configura en Vercel, al menos para **Preview** durante las pruebas:
- `KLING_API_KEY`: clave API de la consola de desarrolladores de Kling.
- `STUDIO_PASSWORD`: contraseña privada del estudio. La persona que genera el video la introduce en la interfaz y el servidor la compara con esta variable.

Las claves se mantienen en variables de entorno del servidor; nunca se añaden al repositorio ni se exponen en JavaScript del navegador. Los endpoints `/api/kling/generate` y `/api/kling/status` validan la contraseña del estudio. El modo Kling solo inicia una generación tras una confirmación explícita de posible consumo de créditos/cargos. Usa el modelo Kling v2.5 Turbo, modo estándar y 5 segundos por defecto; se puede seleccionar 10 segundos. La foto se reduce en el navegador antes de enviarse para respetar los límites de tamaño de la función serverless.

## Costos y privacidad
- Kling es un servicio externo y puede consumir recursos o generar cargos según el saldo/paquete de API de la cuenta.
- No pulses “Generar video con Kling IA” hasta revisar el saldo y el precio actual en la consola oficial.
- Al usar Kling, la foto y el prompt se envían a Kling. El montaje local, en cambio, se procesa en el navegador.
- No actives proveedores externos sin revisar cuota, precio, licencia comercial y método de facturación.

## Prueba manual pendiente
1. Desplegar la rama en Vercel Preview y configurar `KLING_API_KEY` y `STUDIO_PASSWORD` en el entorno Preview.
2. Abrir el estudio y cargar una foto JPG/PNG de producto.
3. Introducir la contraseña del estudio, ajustar el prompt y marcar la confirmación de posible consumo.
4. Iniciar una generación corta y confirmar que el estado progresa y se muestra el video.
5. Revisar que el producto mantenga su color, textura y forma; la generación puede introducir alteraciones.
6. Confirmar el comportamiento ante contraseña incorrecta, saldo insuficiente, fallo del proveedor y tiempo de espera.

La integración de Kling está implementada en la rama de trabajo, pero la prueba real requiere una clave válida con recursos disponibles y un despliegue accesible. No se ha ejecutado ninguna generación desde el repositorio.
