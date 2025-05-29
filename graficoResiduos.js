// graficoResiduos.js - Gráfico de cantidades totales por tipo de residuo

document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    const tiposResiduos = [
        'Autocompostatge', 
        'Matèria orgànica', 
        'Poda i jardineria', 
        'Paper i cartó',
        'Vidre', 
        'Envasos lleugers', 
        'Residus voluminosos + fusta', 
        'RAEE',
        'Ferralla', 
        'Olis vegetals', 
        'Tèxtil', 
        'Runes',
        'Residus en Petites Quantitats (RPQ)', 
        'Piles', 
        'Medicaments',
        'Altres recollides selectives'
    ];

    // Elementos del DOM
    const canvas = document.getElementById('residuosChart');
    const ctx = canvas.getContext('2d');

    // Cargar y procesar datos
    async function cargarDatos() {
        try {
            const response = await fetch('http://localhost:3000/estadistiques');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const datos = await response.json();
            procesarDatos(datos);
            
        } catch (error) {
            console.error('Error al cargar datos:', error);
            mostrarError(error.message);
        }
    }

    // Procesar datos y crear gráfico
    function procesarDatos(datos) {
        // Sumar cantidades totales por tipo de residuo
        const totales = {};
        tiposResiduos.forEach(tipo => totales[tipo] = 0);

        datos.forEach(entry => {
            tiposResiduos.forEach(tipo => {
                const valor = parseFloat(entry[tipo]) || 0;
                totales[tipo] += valor;
            });
        });

        // Convertir a toneladas para mejor visualización
        const labels = Object.keys(totales);
        const values = Object.values(totales).map(val => val / 1000); // kg a toneladas

        crearGrafico(labels, values);
    }

    // Crear gráfico con Chart.js
    function crearGrafico(labels, values) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad total (toneladas)',
                    data: values,
                    backgroundColor: generarColores(labels.length),
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Quantitats totals per tipus de residu (en toneladas)',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} t`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Toneladas'
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 60,
                            minRotation: 45,
                            autoSkip: false
                        }
                    }
                }
            }
        });
    }

    // Generar colores aleatorios para las barras
    function generarColores(cantidad) {
        const colores = [];
        for (let i = 0; i < cantidad; i++) {
            colores.push(`hsl(${Math.random() * 360}, 70%, 60%)`);
        }
        return colores;
    }

    // Mostrar mensaje de error
    function mostrarError(mensaje) {
        canvas.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-grafico';
        errorDiv.innerHTML = `
            <h3>Error al cargar los datos</h3>
            <p>${mensaje}</p>
            <button onclick="location.reload()">Reintentar</button>
        `;
        canvas.parentNode.insertBefore(errorDiv, canvas.nextSibling);
    }

    // Iniciar
    cargarDatos();
});