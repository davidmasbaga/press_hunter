
// const { fetchRSS } = require('./news/news-parser.js');  
// const mediaES = require('./data/mediaES.js');

// (async () => {
//     await fetchRSS(mediaES);
// })();


const Server = require('./models/server')

require('dotenv').config()

const server = new Server()

server.listen()
