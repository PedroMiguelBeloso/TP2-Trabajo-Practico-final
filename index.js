import DBMongo from "./modelo/DBMongo.js";
import config from "./config.js";
import server from "./server.js";

if (config.MODO_PERSISTENCIA === 'MONGODB') {
  await DBMongo.conectar();
} else {
  console.log('Modo persistencia MEM: iniciando sin conexión a MongoDB');
}

server.listen(config.PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${config.PORT}`);
});
