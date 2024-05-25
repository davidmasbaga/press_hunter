const dotenv = require('dotenv');
dotenv.config();
const env = require('env-var');



const envs = {
  EL_PAIS: env.get('EL_PAIS').asUrlString(),
  EL_MUNDO: env.get('EL_MUNDO').asUrlString(),
  DIARIO_ES: env.get('DIARIO_ES').asUrlString(),
  PERIODICO: env.get('PERIODICO').asUrlString(),
  PORT: env.get('PORT').asInt()

};



module.exports = envs;

