# Centro de marketing IA de Igmaustral — plan de implementación

## Estado actual
Se agregó `centro-marketing-ia.html` y un acceso desde `index.html` en la rama de trabajo `feature/estudio-video-ia`. Es un prototipo local-first: no llama a un proveedor de modelos, no consume créditos de generación, no publica automáticamente y no requiere claves API.

## Qué puede hacer la versión inicial
- Crear propuestas de contenido por producto, audiencia, objetivo y canal.
- Preparar borradores para redes, video corto y correo comercial B2B.
- Editar textos y fechas; marcar o quitar la aprobación humana.
- Ver los próximos 14 días en un calendario editorial.
- Crear un brief visual para imágenes que prioriza fidelidad a la foto real.
- Exportar borradores como JSON o CSV.
- Guardar el estado en el almacenamiento local del navegador.

## Limitaciones que deben quedar claras
- Las propuestas se construyen con plantillas locales; todavía no son una llamada a un modelo de IA generativa.
- El almacenamiento local no sincroniza entre dispositivos ni sustituye un respaldo.
- No hay publicación automática ni conexión a cuentas sociales.
- La generación de imagen aún no está conectada en esta página.
- El enlace al estudio de video abre el flujo existente; la generación con Kling puede consumir créditos y requiere confirmación separada.

## Fases siguientes

### Fase 2 — generación de imágenes con presupuesto visible
1. Elegir proveedor después de revisar precios oficiales, condiciones de prueba, límites y política de retención de imágenes.
2. Añadir una pantalla de configuración que muestre proveedor/modelo y una estimación de coste antes de generar.
3. Mantener la clave en una variable de entorno de servidor; nunca en HTML, JavaScript cliente, commits o mensajes.
4. Deshabilitar el botón si falta configuración o si no se confirmó el posible coste.
5. Guardar resultados como borradores y exigir revisión manual.

### Fase 3 — videos y biblioteca de activos
1. Separar el montaje local sin coste de API de la generación de video por proveedor.
2. Antes de cada llamada de pago, mostrar duración, proveedor y confirmación explícita.
3. Registrar ID de tarea, estado, fecha y coste informado por el proveedor cuando esté disponible.
4. Evitar repetir automáticamente una solicitud tras un timeout; primero consultar el estado de la tarea previa.
5. Guardar referencias a los archivos aprobados y dejar que el usuario descargue/exporte.

### Fase 4 — persistencia y analítica
1. Elegir un almacenamiento de servidor si se necesita sincronización entre usuarios o dispositivos.
2. Añadir autenticación y control de acceso antes de guardar datos de negocio en servidor.
3. Medir clics y consultas solo con una solución de analítica configurada y con la información de privacidad necesaria.
4. Crear indicadores sencillos: borradores creados, piezas aprobadas, enlaces de cotización y resultados por canal.

### Fase 5 — publicación, solo con autorización
1. Verificar qué integraciones oficiales permiten publicar y qué permisos requieren.
2. Mostrar una vista previa final, cuenta/canal, fecha y contenido exacto.
3. Exigir una acción explícita por cada publicación.
4. No activar publicación automática hasta que el usuario la solicite expresamente y apruebe sus reglas.

## Criterios de seguridad y coste
- No almacenar claves API en el repositorio ni en el navegador.
- No ejecutar generación externa ni tareas de pago en segundo plano.
- No publicar contenido automáticamente.
- No inventar precios, certificaciones, disponibilidad, prestaciones ni datos técnicos de productos.
- Probar primero en un despliegue Preview y mantener cambios fuera de producción hasta autorización expresa.
- Si una API informa un coste desconocido o no permite comprobar saldo/cuota, no presentarla como gratuita.
- Exportar copias de los borradores antes de borrar almacenamiento local.

## Lista de pruebas manuales para Preview
- Abrir desde el panel y volver al panel.
- Crear una campaña con cada objetivo y revisar que se creen borradores.
- Editar texto, canal y fecha; recargar la página y comprobar persistencia local.
- Aprobar/desaprobar y eliminar una pieza.
- Comprobar la vista de calendario.
- Exportar JSON y CSV y abrir ambos archivos.
- Usar “Crear brief de imagen”; verificar que no se inicia una llamada externa.
- Confirmar que no se publica nada automáticamente.
- Probar en móvil y escritorio.
