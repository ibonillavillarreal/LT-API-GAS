const conexion = require('../config/conexion')
const sql = require('mssql')

const getOrdenEstacion = async (num) => {
  try {    
    console.log(num)
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
    .input('', sql.VarChar, num)
    .input('', sql.Int,1)
      .execute('');
      console.log(salida.recordsets[0][0]);
    return salida.recordsets[0];
  } catch (e) {
    console.log(e)
    return 0;
  }
}

const aplicarSiguienteEstacion = async (id) => {
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('', sql.Int, id)
      .input('', sql.Int, 5)
      .output('',sql.Int,0)
      .execute('');
      console.log(salida.recordsets[0][0])
    return salida.recordsets[0];
  } catch (e) {
    console.log(e)
    return 0;
  }
}
const getRastreo = async (id) => {
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('', sql.Int, id)
      .execute('');
    return salida.recordsets[0];
  } catch (e) {
    console.log(e)
    return 0;
  }
}
module.exports ={
    getOrdenEstacion,
    aplicarSiguienteEstacion,
    getRastreo
}