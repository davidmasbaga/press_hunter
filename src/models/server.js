const express = require('express')
const cors = require('cors');
const envs = require('../plugins/envs.plugins.js');
const { dbConnection } = require('../database/config.js');



class Server {

constructor(){

    this.app = express();
    this.port = envs.PORT;
    this.connectDB()

    this.paths = {

        scrapeEs: '/api/scrape',
        rawArticlesEs: '/api/raw-articles-es',
        openAi:'/api/openai',
        cleanArticlesEs: 'api/clean-articles-es'
    }
    this.middlewares();
    
    this.routes()

}

middlewares(){
    this.app.use(cors());
    this.app.use(express.json());
}



routes() {
    this.app.use(this.paths.scrapeEs, require('../routes/scrape_es.js'));
    this.app.use(this.paths.rawArticlesEs, require('../routes/raw-articles-es.js')),
    this.app.use(this.paths.openAi, require('../routes/open-ai.js')),
    this.app.use(this.paths.cleanArticlesEs, require('../routes/clean-articles-es.js'))
   
   


}


listen() {
    this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
    });
}

async connectDB() {
    dbConnection();

}
}


module.exports = Server;