// Asegúrate de incluir PapaParse y Leaflet en el HTML por separado
// Aquí solo va el JS puro

// Cargar CSV desde URL (puedes cambiar a FileReader si lo cargas con <input>)
fetch('EstacionsRegeneracio.csv')
  .then(response => response.text())
  .then(csvText => {
    // Parsear CSV con PapaParse
    const data = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    }).data;

    // Geocodificar todos los municipios únicos
    const municipiosUnicos = [...new Set(data.map(d => d['Municipi']))];
    const coordenadas = {};

    let pendientes = municipiosUnicos.length;

    municipiosUnicos.forEach(municipio => {
      geocodeMunicipio(municipio).then(coord => {
        coordenadas[municipio] = coord;
        pendientes--;

        if (pendientes === 0) {
          // Ya se han geocodificado todos los municipios
          data.forEach(d => {
            const coords = coordenadas[d['Municipi']];
            d.lat = coords ? coords.lat : null;
            d.lon = coords ? coords.lon : null;
          });

          // Filtrar los que tienen coordenadas
          const datosFiltrados = data.filter(d => d.lat && d.lon);

          // Crear mapa
          const map = L.map('map').setView([41.5, 2.0], 8);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          datosFiltrados.forEach(d => {
            const tratamientos = Object.keys(d)
              .filter(k => k.includes('Tractament') && d[k])
              .map(k => d[k])
              .join(', ');

            const popup = `
              <b>Estación:</b> ${d['ERA']}<br>
              <b>Municipio:</b> ${d['Municipi']}<br>
              <b>Capacidad:</b> ${d['Cabal disseny m3/dia']}<br>
              <b>Tratamientos:</b> ${tratamientos}
            `;
            L.marker([d.lat, d.lon])
              .addTo(map)
              .bindPopup(popup)
              .bindTooltip(d['ERA']);
          });

          // Mostrar tabla
          const tbody = document.querySelector("#tabla tbody");
          datosFiltrados.forEach(d => {
            const tratamientos = Object.keys(d)
              .filter(k => k.includes('Tractament') && d[k])
              .map(k => d[k])
              .join(', ');
            const row = `
              <tr>
                <td>${d['ERA']}</td>
                <td>${d['Municipi']}</td>
                <td>${d['Cabal disseny m3/dia']}</td>
                <td>${tratamientos}</td>
                <td>${d.lat}</td>
                <td>${d.lon}</td>
              </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
          });
        }
      });
    });
  });


// Función para geocodificar usando Nominatim
async function geocodeMunicipio(municipio) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(municipio + ', Spain')}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    } else {
      console.warn(`No encontrado: ${municipio}`);
      return null;
    }
  } catch (error) {
    console.error(`Error geocodificando ${municipio}:`, error);
    return null;
  }
}
