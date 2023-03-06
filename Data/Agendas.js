
"use strict"
const sql = require('mssql')
const DICTIONARY_KEYS = require('../Utils/DICTIONARY_KEYS')
require('dotenv').config()
const conexion = require('../config/conexion')



const add_Agenda = async (json_Agenda) => {
  try {    

    let MasterAgenda = json_Agenda.Master_Agenda;

    let mssql = await sql.connect(conexion);
    let retorno_CodAgenda = await mssql.request()
      .input('CodAgenda', sql.Int, 0)
      .input('IdAgenda', sql.NVarChar, MasterAgenda.IdAgenda)
      .input('DescripcionAgenda', sql.NVarChar, MasterAgenda.DescripcionAgenda)
      .input('EstadoAgenda', sql.Int, 1)
      .input('FechaRegristro', sql.Date, MasterAgenda.FechaRegristro)
      .input('FechaRegSistema', sql.Date, Date(new Date()))
      .input('EstadoRegsistro', sql.Int, 1)
      .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
      .input('Operacion', sql.Int, 2)
    //output('return_value',sql.Int,0)
      .execute('Legales.p_SavetbAgendas')         
    let CodAgenda = retorno_CodAgenda.returnValue;

    //- - -
    let DetalleAsistencia = json_Agenda.Detalle_Asistencia;
    let ultimoRetorno;

    DetalleAsistencia.forEach(registro => {
      let retorno_DetalleAsistencia = mssql.request()
        .input('CodCuorum', sql.Int, 0)
        .input('CodAgenda', sql.Int, CodAgenda)
        .input('CodTipo', sql.Int, registro.CodClaustro)
        .input('CodMiembro', sql.Int, registro.CodMiembro)
        .input('NotaObservacion', sql.NVarChar, registro.NotaObservacion)
        .input('FechaRegistro', sql.Date, Date(new Date()))
        .input('EstadoRegistro', sql.Int, 1)
        .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
        .input('Operacion', sql.Int, 2)
        .execute('Legales.p_SavetbRepresentantes')
      ultimoRetorno = retorno_DetalleAsistencia.returnValue
    });

    // - - - 
    let DetallePuntosAgenda = json_Agenda.Detalle_PuntosAgenda;
    let ultimoRetornoPuntos;

    DetallePuntosAgenda.forEach(reg_DetPuntos => {
      
      let retorno_DetalleAsistencia = mssql.request()
        .input('CodAgendaDetalles', sql.Int, 0)
        .input('CodAgenda', sql.Int, CodAgenda)
        .input('PuntosAgenda', sql.NVarChar, reg_DetPuntos.PuntosAgenda)
        .input('NotaObservacion', sql.NVarChar, reg_DetPuntos.NotaObservacion)
        .input('EstadoPunto', sql.Int, 1)
        .input('FechaRegistro', sql.Date, Date(new Date()))
        .input('EstadoRegistro', sql.Int, 1)
        .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
        .input('Operacion', sql.Int, 2)
        .execute('Legales.p_SavetbAgendaDetalles')
      ultimoRetornoPuntos = retorno_DetalleAsistencia.returnValue
    });

    // - - - 
      return 1;

  } catch (err) {
    console.log(err);
  }
}

const editAgenda = async (json_Agenda) => {

  try {
    
    //console.log(' EDITAR Agenda : '+ JSON.stringify(json_Agenda));

    let MasterAgenda = json_Agenda.Master_Agenda;

    let mssql = await sql.connect(conexion);
    let retorno_CodAgenda = await mssql.request()
      .input('CodAgenda', sql.Int, MasterAgenda.CodAgenda)
      .input('IdAgenda', sql.NVarChar, MasterAgenda.IdAgenda)
      .input('DescripcionAgenda', sql.NVarChar, MasterAgenda.DescripcionAgenda)
      .input('EstadoAgenda', sql.Int, 1)
      .input('FechaRegristro', sql.Date, MasterAgenda.FechaRegristro)
      .input('FechaRegSistema', sql.Date, Date(new Date()))
      .input('EstadoRegsistro', sql.Int, 1)
      .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
      .input('Operacion', sql.Int, 4)    
      .execute('Legales.p_SavetbAgendas')         
    let CodAgenda = retorno_CodAgenda.returnValue;

    //- - -
    let DetalleAsistencia = json_Agenda.Detalle_Asistencia;
    let ultimoRetorno;

    DetalleAsistencia.forEach(registro => {
      let retorno_DetalleAsistencia = mssql.request()
        .input('CodCuorum', sql.Int, registro.CodCuorum)
        .input('CodAgenda', sql.Int, MasterAgenda.CodAgenda)
        .input('CodTipo', sql.Int, registro.CodClaustro)
        .input('CodMiembro', sql.Int, registro.CodMiembro)
        .input('NotaObservacion', sql.NVarChar, registro.NotaObservacion)
        .input('FechaRegistro', sql.Date, Date(new Date()))
        .input('EstadoRegistro', sql.Int, 1)
        .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
        .input('Operacion', sql.Int, 2)
        .execute('Legales.p_SavetbRepresentantes')
      ultimoRetorno = retorno_DetalleAsistencia.returnValue
    });

    // - - - 
    let DetallePuntosAgenda = json_Agenda.Detalle_PuntosAgenda;
    let ultimoRetornoPuntos;

    DetallePuntosAgenda.forEach(reg_DetPuntos => {
      
      let retorno_DetalleAsistencia = mssql.request()
        .input('CodAgendaDetalles', sql.Int, reg_DetPuntos.CodAgendaDetalles)
        .input('CodAgenda', sql.Int, MasterAgenda.CodAgenda)
        .input('PuntosAgenda', sql.NVarChar, reg_DetPuntos.PuntosAgenda)
        .input('NotaObservacion', sql.NVarChar, reg_DetPuntos.NotaObservacion)
        .input('EstadoPunto', sql.Int, 1)
        .input('FechaRegistro', sql.Date, Date(new Date()))
        .input('EstadoRegistro', sql.Int, 1)
        .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
        .input('Operacion', sql.Int, 4)
        .execute('Legales.p_SavetbAgendaDetalles')
      ultimoRetornoPuntos = retorno_DetalleAsistencia.returnValue
    });

    // - - - 
      return 1;

  } catch (edit_err) {
    console.log(edit_err);
  }
}





const getAgenda = async () => {
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('CodAgenda', sql.Int, 0)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GettbAgendas')
    return salida.recordsets;

  } catch (e) {
    console.log(e)
    return "0";
  }
}

//getNroAgenda
const getNroAgenda = async () => {
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .execute('Legales.p_GetNroDeAgendas')
    return salida.recordsets;

  } catch (e) {
    console.log(e)
    return "0";
  }
}




const getAgendaId = async (id) => {
  try {
    let json_Agenda;
    let maestro;
    let asistencia;
    let puntos;

    let mssql = await sql.connect(conexion);
    let salida_maestro = await mssql.request()
      .input('CodAgenda', sql.Int, id)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GettbAgendas');
    maestro = salida_maestro.recordsets[0];

    let salida_asistencia = await mssql.request()
      .input('CodAgenda', sql.Int, id)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbRepresentantes');
    asistencia = salida_asistencia.recordsets[0];

    let salida_puntos = await mssql.request()
      .input('CodAgenda', sql.Int, id)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbAgendaDetalles');
    puntos = salida_puntos.recordsets[0];

    json_Agenda = { Maestro: maestro, Asistencia: asistencia, PuntosDeAgenda: puntos }
    //console.log('full agenda '+ JSON.stringify(json_Agenda))

    return json_Agenda
  } catch (e) {
    console.log(e)
  }
}



module.exports = {
  getAgendaId: getAgendaId,
  getAgenda: getAgenda,
  getNroAgenda: getNroAgenda,
  add_Agenda: add_Agenda,
  editAgenda: editAgenda
};

