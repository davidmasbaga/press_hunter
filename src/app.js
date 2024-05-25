
// import { fetchRSS } from './news/news-parser.js';

// import mediaES from './data/mediaES.js';


// (async () => {
//     await fetchRSS(mediaES,15);
//   })();


const Server = require('./models/server')

require('dotenv').config()

const server = new Server()

server.listen()
