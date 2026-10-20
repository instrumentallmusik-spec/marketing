# Estudio de video de Igmaustral

## Qué incluye esta primera versión
- `estudio-video.html` es un prototipo funcional que se ejecuta en el navegador.
- Genera guiones comerciales basados en plantillas editables.
- Permite cargar una fotografía del producto y montar un video con movimiento de cámara, marca y texto.
- Ofrece formatos vertical 9:16, cuadrado 1:1 y horizontal 16:9.
- Exporta WebM con pista de audio usando MediaRecorder cuando el navegador lo soporta.
- Incluye conversión opcional de WebM a MP4 en el navegador mediante FFmpeg.wasm; descarga de librerías de código abierto desde CDN, sin API de generación de pago.
- Permite cargar una pista propia de música o voz en off; si no se carga audio, añade una base sonora electrónica sencilla generada localmente.
- No utiliza API externa, no requiere claves y no realiza llamadas de pago.
- No guarda imágenes en el servidor ni publica contenido automáticamente.

## Límites conocidos
Esta entrega no genera escenas fotorrealistas nuevas ni voz sintética automática: produce un montaje animado a partir de la foto real. La narración se incorpora cargando una pista de voz en off propia. La conversión MP4 es opcional y puede fallar según navegador, memoria disponible o conexión; WebM queda como alternativa. Es deliberado para habilitar una primera función útil sin activar cobros. La conexión futura a proveedores de video debe ser opt-in, con confirmación de costes y claves guardadas solo en variables de entorno privadas de Vercel.

## Prueba
1. Abre el estudio desde el panel.
2. Selecciona un producto y formato.
3. Carga una foto real JPG o PNG.
4. Pulsa “Crear guion comercial”.
5. Opcionalmente carga una pista de audio (música y/o voz en off). Si no cargas ninguna, se añadirá una base sonora sencilla.
6. Pulsa “Generar video con audio”, espera que termine y revisa el resultado.
7. Pulsa “Convertir a MP4” si necesitas un archivo más compatible con redes; la primera vez descarga librerías grandes y puede tardar. Requiere conexión estable y un navegador actualizado.
8. Revisa la fidelidad del producto, el audio y el texto antes de publicar.

## Seguridad
- No añadas claves API a archivos del repositorio.
- No actives proveedores externos sin revisar cuota, precio, licencia comercial y método de facturación.
- Los videos se generan localmente en el navegador; mantener la pestaña abierta hasta finalizar.
