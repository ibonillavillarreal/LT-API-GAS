
const DBitemDEL = require('../Data/DelItem')

const DelIMiembroItem = async(request, response, next) => {
    try {
        
        console.log('Controlador Couronm por idDelBody : ' + JSON.stringify(request))

        // const idDelBody = { ...request.body }
        // let data = DBitemDEL.DelIMiembroItem(idDelBody)
        // return response.json(data);

        return 1;
    
      } catch (error) {
        next(error)
      }
}


module.exports = {
    DelIMiembroItem
}
