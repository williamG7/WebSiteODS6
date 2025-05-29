
import express from "express";
import fs from "fs";
import cors from "cors";

import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

/*------------------vertidos------------------------*/

const readVertidos = () => {
    try {
        const data = fs.readFileSync("./jsons_folders/Vertidos.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

app.get("/vertidos",(req,res)=>{
    const data=readVertidos();
    res.json(data);
});

/*-------------------Residus_recollida------------------------*/

const readResidus_recollida = () => {
    try {
        const data = fs.readFileSync("./jsons_folders/Residus_recollida.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

app.get("/residusRecollida",(req,res)=>{
    const data=readResidus_recollida();
    res.json(data);
});

/*-------------------Estadistiques------------------------*/


const readEstadistiques = () => {
    try {
        const data = fs.readFileSync("./jsons_folders/Estadistiques.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

app.get("/estadistiques",(req,res)=>{
    const data=readEstadistiques();
    res.json(data);
});
/*-----------------------EstacionsRegeneracio----------------------------*/

const readEstacionsRegeneracio = () => {
    try {
        const data = fs.readFileSync("./jsons_folders/EstacionsRegeneracio.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

app.get("/estacionsRegeneracio",(req,res)=>{
    const data=readEstacionsRegeneracio();
    res.json(data);
});

const calculateWaterVolume = () => {
    const stations = readEstacionsRegeneracio();
    if (!stations || stations.length === 0) return 0;

    let totalCurrent = 0;

    stations.forEach(station => {
        totalCurrent += station["Volum total aigua reutilitzada (m3)"] || 0;
    });

    const averagePerDay = totalCurrent / 368; 
    return averagePerDay;
};


 
app.get("/waterVolume", (req, res) => {
    const volume = calculateWaterVolume();
    res.json({ volume });
});





/*----------------------Embalses-----------------------------*/

const readEmbalses = () => {
    try {
        const data = fs.readFileSync("./jsons_folders/Embalses.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

app.get("/embalses",(req,res)=>{
    const data=readEmbalses();
    res.json(data);
});




//Funció per escoltar
app.listen(3000, ()=>{
    console.log("Server listing on port 3000");
});