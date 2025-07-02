# Scripts JavaScript del Tema CMM Open edX

## courseware-fix.js

Este script corrige el error "courseContentElement is undefined" que puede ocurrir en el archivo `courseware.js` de Open edX.

### Problema que resuelve

El error `Uncaught TypeError: can't access property "dataset", courseContentElement is undefined` ocurre cuando:
- El elemento `.course-content` no existe en la página
- El script `courseware.js` se ejecuta antes de que el DOM esté completamente cargado
- Hay conflictos con otros scripts

### Funcionalidad

- **Detección segura**: Verifica que el elemento `.course-content` existe antes de acceder a sus propiedades
- **Parche automático**: Parchea la funcionalidad original de `Courseware` para evitar errores
- **Inicialización segura**: Inicializa bloques XBlock y histogramas de forma segura
- **Logging**: Proporciona mensajes informativos en la consola para debugging

### Características

- Se ejecuta automáticamente en todas las páginas
- Solo actúa en páginas que contienen el elemento `.course-content`
- Mantiene la funcionalidad original cuando es posible
- Proporciona fallbacks seguros cuando falla la inicialización

### Funciones expuestas

```javascript
window.initCoursewareSafely()  // Inicializa courseware de forma segura
window.patchCourseware()       // Parchea la funcionalidad original
```

## section-label-cleaner.js

Este script se encarga de limpiar automáticamente las etiquetas de secciones del curso y breadcrumbs que contienen patrones específicos.

### Funcionalidad

El script busca y elimina el contenido encerrado por el patrón `[__<|label|>__]` en:
- Títulos de secciones del curso
- Breadcrumbs de navegación

### Ejemplos

**Títulos de Secciones - Antes:**
```html
<h3 class="section-title">Modulo Inicial [__<|label|>__]modini[__<|label|>__]</h3>
```

**Títulos de Secciones - Después:**
```html
<h3 class="section-title">Modulo Inicial </h3>
```

**Breadcrumbs - Antes:**
```html
<span class="nav-item nav-item-chapter">
    <a href="/course/#chapter">Capítulo 1 [__<|label|>__]chap1[__<|label|>__]</a>
</span>
```

**Breadcrumbs - Después:**
```html
<span class="nav-item nav-item-chapter">
    <a href="/course/#chapter">Capítulo 1 </a>
</span>
```

### Elementos afectados

El script busca en los siguientes elementos:

#### Títulos de Secciones:
- `h3.section-title`
- Todos los elementos `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Elementos con clases `.title`, `.section-title`, `.chapter-title`, `.subsection-title`

#### Breadcrumbs:
- `.breadcrumbs .nav-item a` (enlaces de breadcrumbs)
- `.breadcrumbs .nav-item` (elementos de breadcrumbs)

### Características

- Se ejecuta automáticamente cuando se carga la página
- Utiliza `MutationObserver` para detectar contenido cargado dinámicamente
- Se ejecuta múltiples veces para asegurar que todo el contenido sea procesado
- Expone las funciones `window.cleanSectionLabels()` y `window.cleanLabels()` para uso manual si es necesario
- Mantiene compatibilidad con el nombre anterior de la función

### Uso manual

Si necesitas ejecutar la limpieza manualmente, puedes usar cualquiera de estas funciones:

```javascript
window.cleanSectionLabels(); // Nombre anterior (mantiene compatibilidad)
window.cleanLabels();        // Nuevo nombre más genérico
```

### Instalación

Los scripts se incluyen automáticamente en el template principal `main.html` y se cargan en todas las páginas del LMS.

### Orden de carga

1. `courseware-fix.js` - Se carga primero para evitar errores de courseware
2. `section-label-cleaner.js` - Se carga después para limpiar etiquetas

### Templates específicos

Para las páginas de courseware, también se incluye un script adicional en el template `courseware.html` que se enfoca específicamente en la limpieza de breadcrumbs. 