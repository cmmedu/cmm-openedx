/**
 * Fix para el error "courseContentElement is undefined" en courseware.js
 * Este script parchea la funcionalidad de courseware.js para evitar errores cuando
 * el elemento .course-content no existe o no está disponible.
 */

(function() {
  'use strict';

  // Función para verificar si estamos en una página de courseware
  function isCoursewarePage() {
    return document.querySelector('.course-content') !== null;
  }

  // Función para inicializar courseware de forma segura
  function initCoursewareSafely() {
    var courseContentElement = document.querySelector('.course-content');
    
    // Si no existe el elemento, no hacer nada
    if (!courseContentElement) {
      console.log('Courseware: Elemento .course-content no encontrado, saltando inicialización');
      return;
    }

    // Verificar que el elemento tenga dataset antes de acceder
    if (!courseContentElement.dataset) {
      console.log('Courseware: Elemento .course-content no tiene dataset, saltando inicialización');
      return;
    }

    try {
      // Inicializar bloques XBlock de forma segura
      if (typeof XBlock !== 'undefined' && XBlock.initializeBlocks) {
        var blocks = XBlock.initializeBlocks(courseContentElement);
        
        // Verificar si se debe habilitar el servicio de completado
        if (courseContentElement.dataset.enableCompletionOnViewService === 'true') {
          if (typeof RequireJS !== 'undefined' && RequireJS.require) {
            RequireJS.require(['bundles/CompletionOnViewService'], function() {
              if (typeof markBlocksCompletedOnViewIfNeeded === 'function' && blocks && blocks[0] && blocks[0].runtime) {
                markBlocksCompletedOnViewIfNeeded(blocks[0].runtime, courseContentElement);
              }
            });
          }
        }

        // Inicializar histogramas de forma segura
        var histogramElements = document.querySelectorAll('.course-content .histogram');
        histogramElements.forEach(function(element) {
          try {
            var id = element.getAttribute('id').replace(/histogram_/, '');
            var histogramData = element.getAttribute('data-histogram');
            
            if (typeof Histogram !== 'undefined') {
              new Histogram(id, histogramData);
            }
          } catch (error) {
            console.log('Error al inicializar histograma:', error);
          }
        });
      }
    } catch (error) {
      console.log('Error en inicialización de courseware:', error);
    }
  }

  // Función para parchear el Courseware original
  function patchCourseware() {
    // Verificar si Courseware ya está definido
    if (typeof Courseware !== 'undefined') {
      // Guardar la función original
      var originalRender = Courseware.prototype.render;
      
      // Reemplazar con nuestra versión segura
      Courseware.prototype.render = function() {
        try {
          return initCoursewareSafely();
        } catch (error) {
          console.log('Error en render de Courseware:', error);
          // Si falla, intentar con la función original
          if (originalRender) {
            try {
              return originalRender.call(this);
            } catch (originalError) {
              console.log('Error en render original de Courseware:', originalError);
            }
          }
        }
      };
    }
  }

  // Función para inicializar cuando el DOM esté listo
  function init() {
    // Solo ejecutar en páginas de courseware
    if (isCoursewarePage()) {
      // Esperar un poco para que otros scripts se carguen
      setTimeout(function() {
        patchCourseware();
        initCoursewareSafely();
      }, 100);
    }
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // También ejecutar después de un delay para asegurar que courseware.js se haya cargado
  setTimeout(init, 500);

  // Exponer funciones para uso manual si es necesario
  window.initCoursewareSafely = initCoursewareSafely;
  window.patchCourseware = patchCourseware;
})(); 