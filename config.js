/* carga el .env y exporta las variables para usarlas en todo el proyecto. */
import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 8080,
  MODO_PERSISTENCIA: process.env.MODO_PERSISTENCIA || 'MEM',
  STRCNX: process.env.STRCNX,
  BASE: process.env.BASE || 'tp2'
};
