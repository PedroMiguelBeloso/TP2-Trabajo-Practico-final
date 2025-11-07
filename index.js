import DBMongo from "./modelo/DBMongo.js";
import config from "./config.js";
import server from "./server.js";

await DBMongo.conectar();

server.listen(config.PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${config.PORT}`);
});
