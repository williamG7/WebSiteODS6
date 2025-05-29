document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('water-chart');
    if (!container) return;

    // Mostrar estado de carga
    container.innerHTML = `
        <div style="
            padding: 2rem;
            text-align: center;
            background: #f8f9fa;
            border-radius: 8px;
        ">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: #1a5276;">
                Cargando datos de estaciones de regeneración...
            </p>
        </div>
    `;

    try {
        // 1. Cargar datos
        const response = await fetch('http://localhost:3000/estacionsRegeneracio');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        
        // 2. Procesamiento de datos simplificado pero efectivo
        const comarcasData = {};
        
        data.forEach(estacion => {
            if (!estacion.Comarca || !estacion["Volum total aigua reutilitzada (m3)"]) return;
            
            const comarca = estacion.Comarca;
            const volumen = parseFloat(estacion["Volum total aigua reutilitzada (m3)"]);
            
            if (!comarcasData[comarca]) {
                comarcasData[comarca] = {
                    volumenTotal: 0,
                    municipios: new Set()
                };
            }
            
            comarcasData[comarca].volumenTotal += volumen;
            if (estacion.Municipi) comarcasData[comarca].municipios.add(estacion.Municipi);
        });

        // 3. Preparar datos para el gráfico
        const chartData = Object.entries(comarcasData).map(([comarca, datos]) => ({
            comarca,
            volumenTotal: datos.volumenTotal,
            numMunicipios: datos.municipios.size
        }));

        // 4. Crear gráfico con interactividad corregida
        createWaterChart(container, chartData);

        // 5. Cargar volumen diario
        await loadDailyVolume();

    } catch (error) {
        console.error("Error:", error);
        showError(container, error);
    }
});

function createWaterChart(container, chartData) {
    // Guardar referencia a los datos para usar en los eventos
    const dataForHover = chartData;

    const trace = {
        values: chartData.map(d => d.volumenTotal),
        labels: chartData.map(d => d.comarca),
        type: 'pie',
        textinfo: 'percent+label',
        textposition: 'inside',
        hoverinfo: 'label+percent+value',
        hovertemplate: `
            <b>%{label}</b><br>
            Total: %{value:,.0f} m³<br>
            <extra></extra>
        `,
        marker: {
            colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
            line: { color: '#fff', width: 1 }
        }
    };

    const layout = {
        title: {
            text: '<b>DISTRIBUCIÓN DE AGUA REGENERADA POR COMARCA</b>',
            font: { family: 'Arial', size: 18 }
        },
        margin: { t: 80, b: 20, l: 20, r: 20 },
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.2
        }
    };

    Plotly.newPlot(container, [trace], layout);

    // Evento de hover corregido
    container.on('plotly_hover', function(data) {
        const point = data.points[0];
        const comarca = point.label;
        const info = dataForHover.find(d => d.comarca === comarca);
        
        if (info) {
            Plotly.Fx.hover(container, [
                {
                    curveNumber: 0,
                    pointNumber: point.pointNumber
                }
            ], [
                `<b>${comarca}</b><br>
                 Volumen total: ${info.volumenTotal.toLocaleString('es-ES')} m³<br>
                 Municipios: ${info.numMunicipios}`
            ]);
        }
    });
}

async function loadDailyVolume() {
    try {
        const response = await fetch('http://localhost:3000/waterVolume');
        if (!response.ok) throw new Error('Error al cargar volumen diario');
        
        const { volume } = await response.json();
        const element = document.getElementById('daily-volume');
        if (element) {
            element.textContent = volume.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function showError(container, error) {
    container.innerHTML = `
        <div style="
            padding: 2rem;
            background: #fee;
            border-radius: 8px;
            text-align: center;
            color: #d33;
        ">
            <h3 style="margin-top:0;">Error al cargar los datos</h3>
            <p>${error.message}</p>
            <img src="./images/water-fallback.png" 
                 alt="Visualización alternativa" 
                 style="max-width:100%; margin-top:1rem; border-radius:4px;">
            <p style="margin-top:1rem;font-size:0.9em;">
                Datos no disponibles. Intente recargar la página.
            </p>
        </div>
    `;
}