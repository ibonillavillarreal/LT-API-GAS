

const conexion = require('../config/conexion')
const sql = require('mssql')


const DelIMiembroItem = async (id) => {
    try {    
      let mssql = await sql.connect(conexion);
      let salida = await mssql.request()
      .input('CodCuorum', sql.Int, 0)
      .execute("Legales.p_DeletetbRepresentantes"); 
      return salida.returnValue;
    } catch (e) {
      console.log(e)
      return 0;
    }
  }

module.exports = {
    DelIMiembroItem
}