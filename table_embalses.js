
// Funció principal per carregar les dades
async function carregarDadesMaig2025() {
    try {
        // 1. Obtenir dades de l'API
        const resposta = await fetch("http://localhost:3000/embalses");
        if (!resposta.ok) throw new Error("Error en la resposta");
        const dades = await resposta.json();

        // 2. Filtrar per maig 2025
        const dadesMaig2025 = filtrarPerMaig2025(dades);

        // 3. Mostrar a la taula
        mostrarDadesATaula(dadesMaig2025);
    } catch (error) {
        console.error("Error:", error);
        // Si hi ha error, mostrar dades de prova
        mostrarDadesDeProva();
    }
}

// Funció per filtrar dades de maig 2025
function filtrarPerMaig2025(dades) {
    // Si les dades ja tenen camp de data
    if (dades[0] && dades[0]["Data"]) {
        return dades.filter(item => {
            const data = new Date(item["Data"]);
            return data.getFullYear() === 2025 && data.getMonth() === 4; // Maig = mes 4 (0-index)
        });
    }

    // Si no hi ha camp de data, assumim que totes són de maig 2025
    return dades.map(item => ({
        "Estació": item["Estació"],
        "Nivell absolut (msnm)": item["Nivell absolut (msnm)"]
    }));
}

// Funció per mostrar dades de prova
function mostrarDadesDeProva() {
    const dadesDeProva = [
        { "Estació": "Embassament de Sau", "Nivell absolut (msnm)": 152.4 },
        { "Estació": "Embassament de Susqueda", "Nivell absolut (msnm)": 98.7 },
        { "Estació": "Embassament de Siurana", "Nivell absolut (msnm)": 121.2 },
        { "Estació": "Embassament de Foix", "Nivell absolut (msnm)": 87.5 },
        { "Estació": "Embassament de Llosa del Cavall", "Nivell absolut (msnm)": 134.9 }
    ];
    mostrarDadesATaula(dadesDeProva);
}

// Funció per omplir la taula
function mostrarDadesATaula(dades) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    if (!dades || dades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align:center">No hi ha dades disponibles per maig 2025</td></tr>`;
        return;
    }

    dades.forEach(emb => {
        const fila = document.createElement("tr");

        const celdaNom = document.createElement("td");
        celdaNom.textContent = emb["Estació"];
        fila.appendChild(celdaNom);

        const celdaNivell = document.createElement("td");
        celdaNivell.textContent = emb["Nivell absolut (msnm)"].toFixed(1);
        celdaNivell.className = "number-cell";
        fila.appendChild(celdaNivell);

        tbody.appendChild(fila);
    });
}

// Iniciar al carregar la pàgina
window.addEventListener('DOMContentLoaded', carregarDadesMaig2025);
