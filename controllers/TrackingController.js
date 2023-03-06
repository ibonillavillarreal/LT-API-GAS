const DBTracking = require('../Data/Tracking');


const getOrdenEstacion = async (request, response,next) => {
  try{
    DBTracking.getOrdenEstacion(request.params.num).then((data) => {
      response.json(data);
    })
  }catch(ex){
    next(ex)
  } 
}

const aplicarSiguienteEstacion = async (request, response,next) => {
  try{
    DBTracking.aplicarSiguienteEstacion(request.params.id).then((data) => {
      response.json(data);
    })
  }catch(ex){
    next(ex)
  } 
}
const getRastreaEstacion = async (request, response,next) => {
  try{
    DBTracking.getRastreo(request.params.id).then((data) => {
      response.json(data);
    })
  }catch(ex){
    next(ex)
  } 
}
module.exports = {
    getOrdenEstacion,
    aplicarSiguienteEstacion,
    getRastreaEstacion: getRastreaEstacion
}