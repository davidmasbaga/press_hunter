
const envs = require('../plugins/envs.plugins.js');


const mediaES = [
    {media:'esdiario', linkRRSS:envs.DIARIO_ES,paywallClass:'',bodyClass:'.card-content' },
    {media:'elpais', linkRRSS:envs.EL_PAIS,paywallClass:"#ctn_freemium_article",bodyClass:'[data-dtm-region="articulo_cuerpo"]'},
    {media:'elperiodico', linkRRSS:envs.PERIODICO,paywallClass:"#pn-template",bodyClass:'.ft-layout-grid-flex__colXs-12.ft-layout-grid-flex__colSm-11'},
    {media:'elmundo', linkRRSS:envs.EL_MUNDO,paywallClass:".ue-c-article__premium-title",bodyClass:'.ue-c-article__body'},
       
   
];

module.exports = mediaES;