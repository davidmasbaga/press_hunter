const { getAge, getUUID } = require('./plugins');

// const { emailTemplate } = require('./js-foundation/01-template');
// require('./js-foundation/02-destructuring');
// const { getUserById } = require('./js-foundation/03-callbacks');
// const { getUserById } = require('./js-foundation/04-arrow');
// const { buildMakePerson } = require('./js-foundation/05-factory')
const getPokemonById = require('./js-foundation/06-promises');
const {buildLogger} = require ('./plugins' );
const { fetchRSS } = require('./news/news-parser');


// getPokemonById(4)
//   .then( ( pokemon ) => console.log({ pokemon }) )
//   .catch( ( err ) => console.log( err ) )
//   .finally( () => console.log('Finalmente') );



// token de acceso
// Publicas


// ! Referencia a la función factory y uso
// const makePerson = buildMakePerson({ getUUID, getAge });

// const obj = { name: 'John', birthdate: '1985-10-21' };

// const john = makePerson( obj );

// console.log({ john });



// const logger = buildLogger('app.js')
// logger.log('hola mundo')
// logger.error('Esto es algo ')


const elPais = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada';
const abc ='https://www.abc.es/rss/2.0/portada/'
const elMundo ='https://e00-elmundo.uecdn.es/elmundo/rss/espana.xml'
const diarioEs= 'https://www.esdiario.com/rss/articulos.xml'
const Periodico = 'https://www.elperiodico.com/es/rss/rss_portada.xml'


const media = [
    // *HECHO {media:'esdiario', linkRRSS:'https://www.esdiario.com/rss/articulos.xml'},
    // *HECHO {media:'elpais', linkRRSS:'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada'},


    // TODO {media:'elmundo', linkRRSS:'https://e00-elmundo.uecdn.es/elmundo/rss/espana.xml'},
    // TODO {media:'elperiodico', linkRRSS:'https://www.elperiodico.com/es/rss/rss_portada.xml'},
    
    
    // ! Valorar si añadirlo, scrap sucio{media:'abc', linkRRSS:'https://www.abc.es/rss/2.0/portada/'}, 
];



(async () => {
    await fetchRSS(media);
  })();

