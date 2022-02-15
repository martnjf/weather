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
            switch (myObject.Id_Oficina) {
                case null:
                    myObject.Id_Oficina = myObject.ID_ciudad;
                    break;
                default:
                    break;
            }

            const request = new Request(
                "EXEC USP_BI_CSL_insert_reg_RegistroTemperaturaXidOdicina @IdOficina, @Humedad, @Nubes, @Sensacion, @Temperatura, @Descripcion, @Principal, @Icono, @Presion, @Temperatura_Min, @Temperatura_Max, @Nivel_Mar, @Nivel_Tierra, @Velocidad_viento, @Rafagas_viento, @Tiempo_del_calculo_de_clima, @Zona_horaria, @ID_ciudad, @Nombre_Ciudad",
                function (err) {
                    if (err) {
                        console.log("No se pudo insertar dato, (" + index + "), " + err);
                    } else {
                        console.log("Oficina con ID: " + myObject.Id_Oficina + " insertada con éxito.")
                    }
                }
            );
            request.addParameter("IdOficina", TYPES.Int, myObject.Id_Oficina);
            request.addParameter("Humedad", TYPES.SmallInt, myObject.Humedad);
            request.addParameter("Nubes", TYPES.SmallInt, myObject.Nubes);
            request.addParameter("Sensacion", TYPES.Float, myObject.Sensacion);
            request.addParameter("Temperatura", TYPES.Float, myObject.Temperatura);
            request.addParameter("Descripcion", TYPES.NVarChar, myObject.Descripcion);
            request.addParameter("Principal", TYPES.NVarChar, myObject.Principal);
            request.addParameter("Icono", TYPES.NVarChar, myObject.Icono);
            request.addParameter("Presion", TYPES.Float, myObject.Presion);
            request.addParameter("Temperatura_Min", TYPES.Float, myObject.Temperatura_Min);
            request.addParameter("Temperatura_Max", TYPES.Float, myObject.Temperatura_Max);
            request.addParameter("Nivel_Mar", TYPES.Float, myObject.Nivel_Mar);
            request.addParameter("Nivel_Tierra", TYPES.Float, myObject.Nivel_Tierra);
            request.addParameter("Velocidad_viento", TYPES.Float, myObject.Velocidad_viento);
            request.addParameter("Rafagas_viento", TYPES.Float, myObject.Rafagas_viento);
            request.addParameter("Tiempo_del_calculo_de_clima", TYPES.BigInt, myObject.Tiempo_del_calculo_de_clima);
            request.addParameter("Zona_horaria", TYPES.Float, myObject.Zona_horaria);
            request.addParameter("ID_ciudad", TYPES.Float, myObject.ID_ciudad);
            request.addParameter("Nombre_Ciudad", TYPES.NVarChar, myObject.Nombre_Ciudad);

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
        });
}

function myLoop() {
    setTimeout(function () {
        let response = insertOffice(i);
        i++;
        if (i < offices.length) {
            myLoop();
        }
        console.log('Éxito');
        logger.info('Success' + 'ID Ciudad: ' + myObject.ID_ciudad);

    }, 500)
}

myLoop();