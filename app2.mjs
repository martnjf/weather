// Módulos
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
// Archivos
import { offices } from './offices.mjs';
import { logger } from './logger/index.mjs'
// Variables y constantes globales
var i = 0;
const api_key = process.env.APIKEY;

function insertOffice(index) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${offices[index].latjson}&lon=${offices[index].lonjson}&appid=${api_key}&units=metric&lang=sp`;
    fetch(url)
        .then((response) => { return response.json(); })
        .then(function (data) {
            var myObject = {
                Id_Oficina: offices[index].IdOficina,
                Humedad: data.main.humidity,
                Nubes: data.clouds.all,
                Sensacion: data.main.feels_like,
                Temperatura: data.main.temp,
                Descripcion: data.weather[0].description,
                Principal: data.weather[0].main,
                Icono: data.weather[0].icon,
                Presion: data.main.pressure,
                Temperatura_Min: data.main.temp_min,
                Temperatura_Max: data.main.temp_max,
                Nivel_Mar: data.main.sea_level,
                Nivel_Tierra: data.main.grnd_level,
                Velocidad_viento: data.wind.speed,
                Rafagas_viento: data.wind.gust,
                Tiempo_del_calculo_de_clima: data.dt,
                Zona_horaria: data.timezone,
                ID_ciudad: data.id,
                Nombre_Ciudad: data.name
            };
            switch(myObject.Id_Oficina){
                case null:
                    myObject.Id_Oficina = myObject.ID_ciudad;
                    break;
                default:
                    break;
            }
            console.log(myObject);
        });
}

function myLoop() {
    setTimeout(function () {
        try {
            let response = insertOffice(i);
            i++;
            if (i < 3) {
                myLoop();
            }
            logger.info('Success' + 'ID Ciudad: ' + myObject.ID_ciudad);
        } catch (error) {
            logger.error(new Error(error));
        }
    }, 500)
}

myLoop();