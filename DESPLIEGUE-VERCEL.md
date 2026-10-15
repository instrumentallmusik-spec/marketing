# Despliegue en Vercel

## Estado
El repositorio contiene una aplicación estática inicial en `index.html` y configuración básica en `vercel.json`. No requiere instalación de paquetes ni comando de build.

## Conectar GitHub con Vercel
La conexión debe autorizarse en la cuenta del propietario; no se puede crear sin que el usuario complete el acceso en Vercel.

1. Inicia sesión en https://vercel.com/new
2. Elige importar un repositorio Git.
3. Conecta GitHub si todavía no aparece como proveedor conectado y autoriza acceso al repositorio `instrumentallmusik-spec/marketing`.
4. Selecciona el repositorio y la rama `main`.
5. Como la aplicación es HTML estático, deja el framework como Other si no detecta uno y no introduzcas comando de build. El directorio raíz debe ser `./`.
6. Pulsa Deploy y espera el resultado de compilación y la URL asignada.
7. Comprueba la URL generada en móvil y escritorio.

## Actualizaciones automáticas
Una vez conectado, Vercel puede desplegar automáticamente cada nuevo commit de la rama de producción. Los cambios en ramas o pull requests pueden generar despliegues de vista previa según la configuración del proyecto.

## Seguridad y alcance
- El panel no contiene secretos ni claves de API.
- Las casillas del calendario se guardan en el almacenamiento local del navegador del visitante; no son un registro compartido entre usuarios.
- El panel enlaza documentos del repositorio y la web comercial, pero no modifica la web pública de sigmaustral.com.
- No se ha configurado dominio personalizado. Primero probar el dominio de Vercel y después, si se desea, añadir un subdominio separado para el panel.
- Antes de conectar formularios, CRM o generación de vídeo por API, elegir servicios, revisar coste y configurar secretos en el entorno de Vercel.

## Dominio sugerido
Usar un subdominio independiente (por ejemplo, `marketing.igmaustral.com`) solo después de validar el panel. No sustituir ni apuntar el dominio principal del sitio comercial a este proyecto.
