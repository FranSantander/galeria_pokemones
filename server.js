const axios = require("axios");
const http = require("http");
const url = require("url");
const fs = require("fs");

let todosPokemones = [];
let pokemonesPromesas = [];

http
  .createServer((req, res) => {
    if (req.url.startsWith("/pagina")){
        res.writeHead(200, { "Content-Type": "text/html"})
        fs.readFile("index.html", "utf8", (err, html) => {
            res.end(html);
          });

    }

    if (req.url.startsWith("/pokemones")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      async function pokemonesGet() {
        const { data } = await axios.get(
          "https://pokeapi.co/api/v2/pokemon/?limit=151"
        );
        return data.results;
      }

      async function getFullData(url) {
        const { data } = await axios.get(url);
        return data;
      }

      pokemonesGet().then((results) => {
        results.forEach((p) => {
          let pokemonUrl = p.url;
          pokemonesPromesas.push(getFullData(pokemonUrl));
        });
        Promise.all(pokemonesPromesas).then((data) => {
          data.forEach((p) => {
            let pokemon = {
              nombre: `${p.name}`,
              img: `${p.sprites["front_default"]}`,
            };
            todosPokemones.push(pokemon);
            //console.log(`${p.name}`);
          });
          res.write(JSON.stringify(todosPokemones))
          res.end()
        });
      });
        console.log(todosPokemones);
      return todosPokemones;
    }
  })
  .listen(3000, () => console.log("Servidor encendido"));
