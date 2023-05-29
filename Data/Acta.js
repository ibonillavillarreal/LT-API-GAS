
"use strict"

const sql = require('mssql')
const DICTIONARY_KEYS = require('../Utils/DICTIONARY_KEYS')
require('dotenv').config()
const conexion = require('../config/conexion');
const { path } = require('pdfkit');
const { time } = require('console');



const add_Agenda = async (json_Agenda) => {
  try {

    let MasterAgenda = json_Agenda.Master_Agenda;

    let mssql = await sql.connect(conexion);
    let retorno_CodAgenda = await mssql.request()
      .input('CodAgenda', sql.Int, 0)
      .input('IdAgenda', sql.NVarChar, MasterAgenda.IdAgenda)
      .input('Local', sql.NVarChar, MasterAgenda.Local)
      .input('DescripcionAgenda', sql.NVarChar, MasterAgenda.DescripcionAgenda)
      .input('EstadoAgenda', sql.Int, 1)
      .input('FechaRegristro', sql.Date, MasterAgenda.FechaRegristro)
      .input('esHora', sql.NVarChar, MasterAgenda.HoraRegristro)   
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

    let MasterAgenda = json_Agenda.Master_Agenda;

    let mssql = await sql.connect(conexion);
    let retorno_CodAgenda = await mssql.request()
      .input('CodAgenda', sql.Int, MasterAgenda.CodAgenda)
      .input('IdAgenda', sql.NVarChar, MasterAgenda.IdAgenda)
      .input('Local', sql.NVarChar, MasterAgenda.Local)
      .input('DescripcionAgenda', sql.NVarChar, MasterAgenda.DescripcionAgenda)
      .input('EstadoAgenda', sql.Int, 1)
      .input('FechaRegristro', sql.Date, MasterAgenda.FechaRegristro)
      .input('esHora', sql.NVarChar, MasterAgenda.HoraRegristro)   
      .input('FechaRegSistema', sql.Date, Date(new Date()))
      .input('EstadoRegsistro', sql.Int, 1)
      .input('IdUsuario', sql.Int, MasterAgenda.IdUsuario)
      .input('Operacion', sql.Int, 4)
      .execute('Legales.p_SavetbAgendas')
    let CodAgenda = retorno_CodAgenda.returnValue;  
    console.log('Hora como cadaena :' + JSON.stringify(MasterAgenda.HoraRegristro));

    //- - -  limpia los item eliminados
    let itemDelete = json_Agenda.DeleteItem_AgendaAsistencia;
    if (itemDelete[0] > 0) {
      let retorno_itemDel
      itemDelete.forEach(item => {
        let itemDel_Asistencia = mssql.request()
          .input('CodCuorum', sql.Int, item)
          .execute('Legales.p_DeletetbRepresentantes')
        retorno_itemDel = itemDel_Asistencia.returnValue;
      });
    }

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

    //- - - 
    //- - -  limpia Puntos_Agendas item eliminados
    let item_Puntos_Delete = json_Agenda.Delete_PuntosAgenda;
    if (item_Puntos_Delete[0] > 0) {
      let retorno_Puntos_itemDel
      item_Puntos_Delete.forEach(puntos => {
        let itemDel_Puntos = mssql.request()
          .input('CodAgendaDetalles', sql.Int, puntos)
          .execute('Legales.p_DeletetbAgendaDetalles')
        retorno_Puntos_itemDel = itemDel_Puntos.returnValue;
      });
    }
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





const getActaListado = async () => {
  //console.log('Esta llegando a FUNCION');
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('EstadoRegistro', sql.Int, 1)      
      .execute('Legales.p_GettbActas')
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

    return json_Agenda
  } catch (e) {
    console.log(e)
  }
}


const DelEditAgenda = async (obj) => {
  try {
    let pool = await sql.connect(conexion);
    let salida = await pool.request()
      .input('CodAgenda', sql.Int, obj.CodAgenda)
      .input('EstadoRegsistro', sql.Int, obj.estado)
      .input('IdUsuario', sql.Int, obj.idUser)
      .input('Operacion', sql.Int, 4)
      .execute('Legales.p_DeletetbAgendas')

    return salida.returnValue;
  } catch (err) {
    console.log(err);
    return 0;
  }
}


const imprimir = async (id) => {
  
  try {
    let mssql = await sql.connect(conexion);
    let salida_maestro = await mssql.request()
      .input('CodAgenda', sql.Int, id)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GettbAgendas');
    return salida_maestro.recordsets[0][0];    

  } catch (err) {
    console.log(err);
    return 0;
  }
}

module.exports = {
  getAgendaId: getAgendaId,
  getActaListado: getActaListado,
  getNroAgenda: getNroAgenda,
  add_Agenda: add_Agenda,
  editAgenda: editAgenda,
  imprimir, imprimir,
  DelEditAgenda: DelEditAgenda
};

