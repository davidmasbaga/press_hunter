const express = require('express')
const cors = require('cors');
const envs = require('../plugins/envs.plugins.js');



class Server {

constructor(){

    this.app = express();
    this.port = envs.PORT;


    this.paths = {

        scrapeEs: '/api/scrape',
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
   
    


}


listen() {
    this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
    });
}

}


module.exports = Server;