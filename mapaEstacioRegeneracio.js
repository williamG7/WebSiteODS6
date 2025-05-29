document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('water-chart');
    if (!container) return;

    // Mostrar loader simple
    container.innerHTML = '<div style="text-align:center;padding:50px;color:#666;">Cargando datos...</div>';

    try {
        // 1. Cargar datos
        const response = await fetch('http://localhost:3000/estacionsRegeneracio');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        
        // 2. Procesamiento mínimo de datos
        const comarcas = {};
        data.forEach(item => {
            if (!item.Comarca || !item['Volum total aigua reutilitzada (m3)']) return;
            
            const comarca = item.Comarca;
            const volumen = parseFloat(item['Volum total aigua reutilitzada (m3)']);
            
            if (comarca && !isNaN(volumen)) {
                comarcas[comarca] = (comarcas[comarca] || 0) + volumen;
            }
        });

        const chartData = Object.entries(comarcas).map(([nombre, volumen]) => ({
            nombre,
            volumen
        }));

        // 3. Limpiar contenedor
        container.innerHTML = '';

        // 4. Crear gráfico centrado
        Plotly.newPlot(container, [{
            values: chartData.map(d => d.volumen),
            labels: chartData.map(d => d.nombre),
            type: 'pie',
            textinfo: 'percent+label',
            textposition: 'inside',
            hoverinfo: 'label+percent+value',
            marker: {
                colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
            }
        }], {
            title: 'Distribución del Agua Regenerada por Comarca',
            margin: { t: 40, b: 20, l: 20, r: 20 },
            showlegend: true,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        });

        // 5. Cargar volumen diario
        const volResponse = await fetch('http://localhost:3000/waterVolume');
        if (volResponse.ok) {
            const { volume } = await volResponse.json();
            const volElement = document.getElementById('daily-volume');
            if (volElement) volElement.textContent = volume.toFixed(2);
        }

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:#e74c3c;">
                Error al cargar los datos: ${error.message}
            </div>
        `;
    }
});