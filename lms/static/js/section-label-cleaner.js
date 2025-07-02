/**
 * Script para limpiar etiquetas de secciones del curso y breadcrumbs
 * Remueve el contenido encerrado por [__<|label|>__] en los títulos de secciones y breadcrumbs
 */

(function() {
  'use strict';

  // Función para limpiar el contenido encerrado por [__<|label|>__]
  function cleanLabels() {
    // Buscar todos los elementos h3 con la clase section-title
    var sectionTitles = document.querySelectorAll('h3.section-title');
    
    sectionTitles.forEach(function(element) {
      var text = element.innerHTML;
      
      // Patrón regex para encontrar contenido encerrado por [__<|label|>__]
      // Busca cualquier texto entre [__<|label|>__] y [__<|label|>__]
      var pattern = /\[__&lt;\|label\|&gt;__\](.*?)\[__&lt;\|label\|&gt;__\]/g;
      
      // Reemplazar el contenido encontrado con una cadena vacía
      var cleanedText = text.replace(pattern, '');
      
      // Actualizar el contenido del elemento
      element.innerHTML = cleanedText;
    });
    
    // También buscar en otros elementos que puedan contener estos patrones
    var allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .title, .section-title, .chapter-title, .subsection-title');
    
    allElements.forEach(function(element) {
      var text = element.innerHTML;
      
      // Patrón regex para encontrar contenido encerrado por [__<|label|>__]
      var pattern = /\[__&lt;\|label\|&gt;__\](.*?)\[__&lt;\|label\|&gt;__\]/g;
      
      // Reemplazar el contenido encontrado con una cadena vacía
      var cleanedText = text.replace(pattern, '');
      
      // Actualizar el contenido del elemento
      element.innerHTML = cleanedText;
    });

    // Limpiar breadcrumbs
    var breadcrumbElements = document.querySelectorAll('.breadcrumbs .nav-item a, .breadcrumbs .nav-item');
    
    breadcrumbElements.forEach(function(element) {
      var text = element.innerHTML;
      
      // Patrón regex para encontrar contenido encerrado por [__<|label|>__]
      var pattern = /\[__&lt;\|label\|&gt;__\](.*?)\[__&lt;\|label\|&gt;__\]/g;
      
      // Reemplazar el contenido encontrado con una cadena vacía
      var cleanedText = text.replace(pattern, '');
      
      // Actualizar el contenido del elemento
      element.innerHTML = cleanedText;
    });
  }

  // Función para inicializar el limpiador
  function initLabelCleaner() {
    // Ejecutar la limpieza cuando el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cleanLabels);
    } else {
      cleanLabels();
    }
    
    // También ejecutar después de un pequeño delay para asegurar que el contenido dinámico se haya cargado
    setTimeout(cleanLabels, 1000);
    
    // Ejecutar cuando se detecten cambios en el DOM (para contenido cargado dinámicamente)
    if (window.MutationObserver) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Esperar un poco para que el contenido se renderice completamente
            setTimeout(cleanLabels, 100);
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Inicializar cuando el script se carga
  initLabelCleaner();

  // Exponer las funciones globalmente para uso manual si es necesario
  window.cleanSectionLabels = cleanLabels; // Mantener compatibilidad con el nombre anterior
  window.cleanLabels = cleanLabels; // Nuevo nombre más genérico
})(); 