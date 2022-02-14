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
// Configuración de conexión 
var config = {
    server: process.env.SERVER,
    authentication: {
        type: "default",
        options: {
            userName: process.env.USER,
            password: process.env.PASSWORD,
        },
    },
    options: {
        encrypt: true,
        database: process.env.DB,
    }
};

function insertOffice(index) {
    var connection = new Connection(config);
    connection.on("connect", function (err) {
        console.log("Successful connection");
    });
    connection.connect();

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${offices[index].latjson}&lon=${offices[index].lonjson}&appid=${api_key}&units=metric&lang=sp`;
    fetch(url)
        .then((response) => { return response.json(); })
        .then(function (data) {
            var myObject = {
                Id_Oficina: offices[index].IdOficina,
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

            const request = new Request(
                "EXEC USP_BI_CSL_insert_reg_RegistroTemperaturaXidOdicina @IdOficina, @Humedad, @Nubes, @Sensacion, @Temperatura, @Descripcion",
                function (err) {
                    if (err) {
                        console.log("No se pudo insertar dato, (" + index + "), " + err);
                    } else {
                        console.log("Oficina con ID: " + myObject.Id_Oficina + " insertada con éxito. Inserción número " + index + 1 + ".")
                    }
                }
            );
            request.addParameter("IdOficina", TYPES.SmallInt, myObject.Id_Oficina);
            request.addParameter("Humedad", TYPES.SmallInt, myObject.Humedad);
            request.addParameter("Nubes", TYPES.SmallInt, myObject.Nubes);
            request.addParameter("Sensacion", TYPES.Float, myObject.Sensacion);
            request.addParameter("Temperatura", TYPES.Float, myObject.Temperatura);
            request.addParameter("Descripcion", TYPES.NVarChar, myObject.Descripcion);

            request.on("row", function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log("NULL");
                    } else {
                        console.log("Product id of inserted item is " + column.value);
                    }
                });
            });
            request.on("requestCompleted", function () {
                connection.close();
            });
            connection.execSql(request);
            // console.log(request); Impresión del request
        });
}

function myLoop() {
    setTimeout(function () {
        try {
            let response = insertOffice(i);
            i++;
            if (i < offices.length) {
                myLoop();
            }
            // throw Error('unexpected Error');
            console.log('Éxito');
            logger.info('Success');
        } catch (error) {
            console.log('Acurrió un error');
            logger.error(new Error(error));
        }
    }, 500)
}

myLoop();