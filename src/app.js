
import { fetchRSS } from './news/news-parser.js';
import { envs } from './plugins/envs.plugins.js';





const media = [
    {media:'esdiario', linkRRSS:envs.DIARIO_ES},
    {media:'elpais', linkRRSS:envs.EL_PAIS},
    {media:'elperiodico', linkRRSS:envs.PERIODICO},
    {media:'elmundo', linkRRSS:envs.EL_MUNDO},
    
    
   
];




(async () => {
    await fetchRSS(media);
  })();

