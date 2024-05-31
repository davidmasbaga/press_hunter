const { getUUID } = require('../plugins/get-id.plugin');
const { getAge }  = require('../plugins/get-age.plugin');

const { http } = require('../plugins/http-client.plugin');
const buildLogger = require ('../plugins/logger.plugin');
const { envs } = require('./envs.plugins');



module.exports = {
  getAge, 
  getUUID,
  http,
  buildLogger,
  envs
  
}