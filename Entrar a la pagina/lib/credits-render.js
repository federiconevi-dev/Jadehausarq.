(function() {
  'use strict';

  var creditsList = document.querySelector('[data-credits]');
  if (!creditsList) return;

  // Cargar el archivo JSON
  fetch('assets/credits.json')
    .then(function(response) {
      if (!response.ok) throw new Error('No se pudo cargar credits.json');
      return response.json();
    })
    .then(function(data) {
      var html = '';
      var keys = Object.keys(data).sort();
      
      keys.forEach(function(key) {
        var credit = data[key];
        var licenseName = getLicenseName(credit.license, credit.license_version);
        
        html += '<li>';
        html += '<strong>' + escapeHtml(credit.title) + '</strong><br>';
        html += 'Por <a href="' + escapeHtml(credit.creator_url) + '" target="_blank" rel="noopener">' + escapeHtml(credit.creator) + '</a> · ';
        html += '<a href="' + escapeHtml(credit.license_url) + '" target="_blank" rel="noopener">' + licenseName + '</a> · ';
        html += 'Fuente: <a href="' + escapeHtml(credit.foreign_landing_url) + '" target="_blank" rel="noopener">' + escapeHtml(credit.source) + '</a>';
        html += '</li>';
      });
      
      creditsList.innerHTML = html;
    })
    .catch(function(error) {
      creditsList.innerHTML = '<li>Error al cargar los créditos. Por favor intenta más tarde.</li>';
      console.error('Error cargando créditos:', error);
    });

  function getLicenseName(license, version) {
    var names = {
      'by': 'CC BY',
      'by-sa': 'CC BY-SA',
      'by-nd': 'CC BY-ND',
      'by-nc': 'CC BY-NC',
      'by-nc-sa': 'CC BY-NC-SA',
      'by-nc-nd': 'CC BY-NC-ND',
      'cc0': 'CC0'
    };
    var name = names[license.toLowerCase()] || license.toUpperCase();
    return version ? name + ' ' + version : name;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
