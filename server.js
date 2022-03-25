//Constante para importar las dependencias del script a utilizar
const axios = require("axios");
const http = require("http");
const url = require("url");
const fs = require("fs");

//Función vacía para luego llenar los 151 pokemones
let todosPokemones = [];
let pokemonesPromesas = [];

//Creando el servidor
http
  .createServer((req, res) => {
    if (req.url.startsWith("/pagina")){//lectura del html
        res.writeHead(200, { "Content-Type": "text/html"})
        fs.readFile("index.html", "utf8", (err, html) => {
            res.end(html);
          });

    }
    //Requerimiento 3
    if (req.url.startsWith("/pokemones")) {//muestra el arreglo
      res.writeHead(200, { "Content-Type": "application/json" });
      async function pokemonesGet() {
        const { data } = await axios.get(
          "https://pokeapi.co/api/v2/pokemon/?limit=151"
        );
        return data.results;
      }
    //Requerimiento 1
      async function getFullData(url) {
        const { data } = await axios.get(url);
        return data;
      }
      //Recorrido la url para los datos de los 151 pokemones
      pokemonesGet().then((results) => {
        results.forEach((p) => {
          let pokemonUrl = p.url;
          pokemonesPromesas.push(getFullData(pokemonUrl));//acceso a la info 1 pokemon
        });
        //Requerimiento 2: arreglo de promesas
        Promise.all(pokemonesPromesas).then((data) => {
          data.forEach((p) => {
            //formato de objeto para "llenar" el arreglo vacío todosPokemones
            let pokemon = {
              nombre: `${p.name}`,
              img: `${p.sprites["front_default"]}`,
            };
            todosPokemones.push(pokemon);
            //console.log(`${p.name}`);
          });
          res.write(JSON.stringify(todosPokemones))//transforma a formato JSON
          res.end()
        });
      });
        console.log(todosPokemones);
      return todosPokemones;
    }
  })
  .listen(3000, () => console.log("Servidor encendido"));
