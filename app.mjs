import fetch from "node-fetch";
import { Request, TYPES, Connection } from "tedious";
import { offices } from './offices.mjs';
import { performance }  from "perf_hooks";

import dotenv from "dotenv";
dotenv.config();

const api_key = process.env.APIKEY;

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
            };

            const request = new Request(
                "EXEC USP_BI_CSL_insert_reg_RegistroTemperaturaXidOdicina @IdOficina, @Humedad, @Nubes, @Sensacion, @Temperatura, @Descripcion",
                function (err) {
                    if (err) {
                        console.log("No se pudo insertar dato, (" + index + "), " + err);
                    } else {
                        console.log("Dato con id de Oficina: " + myObject.Id_Oficina +" insertado con éxito. (" + index + ").")
                    }
                }
            );
            request.addParameter("IdOficina", TYPES.SmallInt, myObject.Id_Oficina);
            request.addParameter("Humedad", TYPES.SmallInt, myObject.Humedad);
            request.addParameter("Nubes", TYPES.SmallInt, myObject.Nubes);
            request.addParameter("Sensacion", TYPES.Float, myObject.Sensacion);
            request.addParameter("Temperatura", TYPES.Float, myObject.Temperatura);
            request.addParameter("Descripcion", TYPES.VarChar, myObject.Descripcion);

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

function functionLooper() {
    for (let i = 0; i < offices.length; i++) {
        let response = insertOffice(i);
    }
}

var startTime = performance.now();

functionLooper();

var endTime = performance.now();
console.log(`Tiempo de ejecución ${endTime - startTime} milisegundos`);