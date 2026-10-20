# Estudio de video de Igmaustral

## Qué incluye esta primera versión
- `estudio-video.html` es un prototipo funcional que se ejecuta en el navegador.
- Genera guiones comerciales basados en plantillas editables.
- Permite cargar una fotografía del producto y montar un video con movimiento de cámara, marca y texto.
- Ofrece formatos vertical 9:16, cuadrado 1:1 y horizontal 16:9.
- Exporta WebM usando MediaRecorder cuando el navegador lo soporta.
- No utiliza API externa, no requiere claves y no realiza llamadas de pago.
- No guarda imágenes en el servidor ni publica contenido automáticamente.

## Límites conocidos
Esta primera entrega no genera escenas fotorrealistas nuevas ni una voz sintética: produce un montaje animado a partir de la foto real. Es deliberado para habilitar una primera función útil sin activar cobros. La conexión futura a proveedores de video debe ser opt-in, con confirmación de costes y claves guardadas solo en variables de entorno privadas de Vercel.

## Prueba
1. Abre el estudio desde el panel.
2. Selecciona un producto y formato.
3. Carga una foto real JPG o PNG.
4. Pulsa “Crear guion comercial”.
5. Pulsa “Generar video sin coste”, espera que termine y descarga el archivo WebM.
6. Revisa la fidelidad del producto y el texto antes de publicar.

## Seguridad
- No añadas claves API a archivos del repositorio.
- No actives proveedores externos sin revisar cuota, precio, licencia comercial y método de facturación.
- Los videos se generan localmente en el navegador; mantener la pestaña abierta hasta finalizar.
