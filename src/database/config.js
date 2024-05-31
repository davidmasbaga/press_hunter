const mongoose = require('mongoose');   


const dbConnection = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log('DB Online');
    }catch(error){
       
        console.log('no se ha podido conectar a la base de datos')

}
}

module.exports = {dbConnection}