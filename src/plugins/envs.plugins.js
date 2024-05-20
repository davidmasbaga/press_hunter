import dotenv from 'dotenv';
dotenv.config();
import env from 'env-var';



export const envs = {
  EL_PAIS: env.get('EL_PAIS').asUrlString(),
  EL_MUNDO: env.get('EL_MUNDO').asUrlString(),
  DIARIO_ES: env.get('DIARIO_ES').asUrlString(),
  PERIODICO: env.get('PERIODICO').asUrlString(),

};




