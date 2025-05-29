// mapaVertidos.js - Mapa de vertidos peligrosos en Cataluña

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa centrado en Cataluña
    const map = L.map('map').setView([41.3851, 2.1734], 8);

    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Icono personalizado para vertidos peligrosos
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Cargar y mostrar datos de vertidos
    function cargarVertidos() {
        fetch('http://localhost:3000/vertidos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    throw new Error('No hay datos de vertidos disponibles');
                }

                let vertidosPeligrosos = 0;
                
                data.forEach(vertido => {
                    if (vertido['Matèria Perillosa'] === true && vertido.Latitud && vertido.Longitud) {
                        vertidosPeligrosos++;
                        
                        const marker = L.marker([vertido.Latitud, vertido.Longitud], {
                            icon: redIcon
                        }).addTo(map);
                        
                        marker.bindPopup(`
                            <b>Municipio:</b> ${vertido['Terme municipal'] || 'No disponible'}<br/>
                            <b>Tipo:</b> ${vertido.Tipus || 'No disponible'}<br/>
                            <b>Peligroso:</b> Sí<br/>
                            <b>Fecha:</b> ${vertido.Data || 'No disponible'}
                        `);
                    }
                });

                if (vertidosPeligrosos === 0) {
                    mostrarMensaje('No se encontraron vertidos peligrosos con ubicación válida');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarMensaje(error.message || 'Error cargando los datos de vertidos');
            });
    }

    // Mostrar mensaje de error en el mapa
    function mostrarMensaje(mensaje) {
        map.setView([41.3851, 2.1734], 8);
        L.marker([41.3851, 2.1734]).addTo(map)
            .bindPopup(`<b>Error:</b> ${mensaje}`)
            .openPopup();
    }

    // Añadir capa de ríos importantes
    function añadirRios() {
        const rios = [
            {nombre: "Río Llobregat", coords: [[41.35, 1.95], [41.45, 2.15]]},
            {nombre: "Río Besòs", coords: [[41.45, 2.2], [41.55, 2.3]]},
            {nombre: "Río Ter", coords: [[41.9, 2.8], [42.0, 2.9]]}
        ];
        
        rios.forEach(rio => {
            L.polyline(rio.coords, {
                color: 'blue',
                weight: 3,
                opacity: 0.5
            }).addTo(map).bindPopup(`<b>${rio.nombre}</b>`);
        });
    }

    // Iniciar el mapa
    cargarVertidos();
    añadirRios();
});