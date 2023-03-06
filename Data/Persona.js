
"use strict"
const sql = require('mssql')
const DICTIONARY_KEYS = require('../Utils/DICTIONARY_KEYS')
require('dotenv').config()
const conexion = require('../config/conexion')
const { json } = require('express')


const getClientes = async () => {
  try {

    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
    .input('EstadoRegistro',sql.Int,1)
      .execute('RRHH.p_GettbMiembros')      
     
    return salida.recordsets;

  } catch (e) {
    console.log(e)    
    return "0";
  }
}

const getCliente = async (id) => {    
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('CdoMiembro', sql.Int, id)
      .input('EstadoRegistro',sql.Int,1)
      .execute('RRHH.p_GettbMiembros');
      
    return salida.recordsets;

  } catch (e) {   
    console.log(e)
    return "0";
  }
}

const addCliente = async (persona) => {
    
  try {
    let pool = await sql.connect(conexion);
    let insertCliente = await pool.request()
    .input('CodMiembro',sql.Int,persona.CodMiembro)
    .input('CodCargo',sql.Int,persona.CodCargo)
    .input('CodClaustro',sql.Int,persona.CodClaustro)
    .input('CodGradoAcademico',sql.Int,persona.CodGradoAcademico)
    .input('Nombres',sql.VarChar,persona.Nombres)
    .input('Apellidos',sql.VarChar,persona.Apellidos)
    .input('Telefono',sql.VarChar,persona.Telefono)
    .input('Email',sql.VarChar,persona.Email)
    .input('FechaRegistro',sql.Date,new Date())
    .input('EstadoRegistro',sql.Int,1)
    .input('IdUsuario',sql.Int,persona.IdUsuario)
    .input('Operacion',sql.Int,2)    
    .output('return_value', sql.Int, 0)
      .execute('RRHH.p_SavetbMiembros'); 
    
      return insertCliente.output; 
  }
  catch (err) {
    console.log(err);
    return 0;

  }
}


const editPersona = async (persona) => {
  try {  
    let pool = await sql.connect(conexion);
    let edtPersona = await pool.request()
    .input('CodMiembro',sql.Int,persona.CodMiembro)
    .input('CodCargo',sql.Int,persona.CodCargo)
    .input('CodClaustro',sql.Int,persona.CodClaustro)
    .input('CodGradoAcademico',sql.Int,persona.CodGradoAcademico)
    .input('Nombres',sql.VarChar,persona.Nombres)
    .input('Apellidos',sql.VarChar,persona.Apellidos)
    .input('Telefono',sql.VarChar,persona.Telefono)
    .input('Email',sql.VarChar,persona.Email)
    .input('FechaRegistro',sql.Date,new Date())
    .input('EstadoRegistro',sql.Int,1)
    .input('IdUsuario',sql.Int,persona.IdUsuario)
    .input('Operacion',sql.Int,2)    
    .output('return_value', sql.Int, 0)
      .execute('RRHH.p_SavetbMiembros');
      
      //return edtPersona.rowsAffected;
      return edtPersona.output;
  }
  catch (err) {
    console.log(err);
    return 0;

  }
}

const anularCliente = async (id_User) => {  
  try {
    let pool = await sql.connect(conexion);
    let salida = await pool.request()
      .input('CodMiembro', sql.Int, id_User.id)
      .input('IdUsuario', sql.Int, id_User.idUser)
      .input('FisicoDell', sql.Int, id_User.operacion)
      .output('return_value', sql.Int, 0)
      .execute('RRHH.p_DeletetbMiembros')
      return salida.output;
  } catch (err) {
    console.log(err);
    return 0;
  }
}



const getClienteEdit = async (id) => {
  try {
    console.log(' LLegando getClienteEdit ')

    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
    .input('CdoMiembro', sql.Int, id)
    .input('EstadoRegistro', sql.Int,1)
    .execute('RRHH.p_GettbMiembros');      
    return salida.recordsets;

  } catch (e) {
    console.log(e)    
  }
}




module.exports = {
  getClientes,
  getCliente,
  addCliente,
  editPersona: editPersona,
  anularCliente,
  getClienteEdit
  
};