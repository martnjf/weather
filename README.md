# Weather.

- 💻 [Node JS](https://nodejs.org/es/)
- 💻 [Used doc](https://docs.microsoft.com/en-us/sql/connect/node-js/step-3-proof-of-concept-connecting-to-sql-using-node-js?view=sql-server-ver15).
- 💻 [Tedious JS](https://tediousjs.github.io/tedious/)
- 💻 [Open Weather API](https://openweathermap.org/api)
#
Proyecto que toma datos del clima de varias ciudades de México y los guarda.
```data2``` es un arreglo de objetos, cada objeto contiene el ID the diferentes oficinas por todo México, cada una con una latitud y una longitud.
Estas (latitud y longitud) son usadas para obtener el clima de la ciudad, usando la API de Open Weather API.

```functionLooper();``` es una función que cicla ```insertOffice()``` un número de veces definido por el número de objetos en ```data2```, enviando ```index``` también.

Al correr ```insertOffice()```:
- Se crea una conexión a base de datos usando Tedious JS.
- Recupera el url de la API con la latitud y longitud del arreglo ```data2```, junto a la llave de la api.
- Crea un objeto ```myObject```, el cual tiene el ID y datos recopilados de la API de clima, como humedad, etc...
- El "Request" corre el Procedimiento Almacenado.
- Cierra la conexión.
- Corre de nuevo ```insertOffice```

#

Project that takes data and saves the weather from different cities around Mexico.
```data2``` is an array of objects, each object contains the ID of different offices around Mexico, each one with a Latitude and a Longitude.
This (lat and lon) are used to get the weather of the city, using Open Weather API.

```functionLooper();``` is a function that Loops ```insertOffice()``` depending of the objects in ```data2```, sending ```index``` too.
Running ```insertOffice()```:
- Creates a connection to DB using Tedious JS.
- Fetches the url of the API with the latitude and longitude of the office and with the api key.
- Creates an object ```myObject```, which has the ID and weather data from the API, such as Humidity, etc...
- Request runs the Stored Procedure.
- Closes the connection.
- Runs again ```insertOffice()```.
