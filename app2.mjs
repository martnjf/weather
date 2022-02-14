// Módulos
import fetch from "node-fetch";
import { Request, TYPES, Connection } from "tedious";
import dotenv from "dotenv";
dotenv.config();
// Archivos
import { offices } from './offices.mjs';
import { logger } from './logger/index.mjs'
// Variables y constantes globales
var i = 0;
const api_key = process.env.APIKEY;

function insertOffice() {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${offices[0].latjson}&lon=${offices[0].lonjson}&appid=${api_key}&units=metric&lang=sp`;
    fetch(url)
        .then((response) => { return response.json(); })
        .then(function (data) {
            var myObject = {
                Id_Oficina: offices[0].IdOficina,
                Latitud:data.coord.lat,
                Longitud:data.coord.lon,
                Id: data.weather[0].id,
                Principal: data.weather[0].main,
                Descripcion: data.weather[0].description,
                Icono: data.weather[0].icon,
                Temperatura: data.main.temp,
                Sensacion: data.main.feels_like,
                Presion: data.main.pressure,
                Humedad: data.main.humidity,
                Temperatura_minima: data.main.temp_min,
                Temperatura_maxima: data.main.temp_max,
                Nivel_del_mar: data.main.sea_level,
                Nivel_de_tierra: data.main.grnd_level,
                Velocidad_del_viento: data.wind.speed,
                Rafagas_de_viento: data.wind.gust,
                Nubes: data.clouds.all, 
                Tiempo_del_calculo_del_clima: data.dt,
                Zona_horaria: data.timezone,
                ID_ciudad: data.id,
                Nombre_de_la_ciudad: data.name
            };
            console.log(myObject);
        });
}

insertOffice()