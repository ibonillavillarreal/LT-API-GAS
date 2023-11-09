

"use strict"
const sql = require('mssql')
const DICTIONARY_KEYS = require('../Utils/DICTIONARY_KEYS')
require('dotenv').config()
const conexion = require('../config/conexion')
const { json } = require('express')


//usuarioGet
const usuarioGet = async (login) => {
    try {
        let mssql = await sql.connect(conexion);
        let salida = await mssql.request()
            .input('Login', sql.NVarChar,login.user) //@Login nvarchar(MAX),
            .input('Psw',  sql.NVarChar,login.psw)  //@Psw nvarchar(MAX),  
            .input('EstadoRegistro', sql.Int, 1)            //@EstadoRegistro INT
            .execute('Seguridad.sp_Get_tbUsuario'); //exec [Seguridad].[sp_Get_tbUsuario] "ibonilla","123",1
        return salida.recordset[0];

    } catch (e) {
        console.log(e)
        return "0";
    }
}

//usuarioRolModulos
const usuarioRolModulos = async (CodUsuario) => {
    try {
        let mssql = await sql.connect(conexion);
        let salida = await mssql.request()
            .input('CodUsuario', sql.Int,CodUsuario)                
            .execute('Seguridad.sp_Get_tbRolModule');      // EXEC [Seguridad].[sp_Get_tbRolModule] 1
            
            //console.log('Salida recordsetSss :'+JSON.stringify(salida.recordset));
        return salida.recordset

    } catch (e) {
        console.log(e)
        return "0";
    }
}

//usuariosGet
const usuariosGet = async () => {
    try {

        let mssql = await sql.connect(conexion);
        let salida = await mssql.request()
            .input('Estado', sql.Int, 1)
            .execute('')

        return salida.recordsets;

    } catch (e) {
        console.log(e)
        return "0";
    }
}

//usuariosPut
const usuariosPut = async (login) => {

    try {
        let pool = await sql.connect(conexion);
        let insertCliente = await pool.request()
            .input('Cod', sql.Int, login.CodMiembro)
            .input('Cod', sql.Int, login.CodCargo)
            .output('return_value', sql.Int, 0)
            .execute('');

        return insertCliente.output;
    }
    catch (err) {
        console.log(err);
        return 0;

    }
}

//usuariosPost
const usuariosPost = async (login) => {
    try {
        let pool = await sql.connect(conexion);
        let edtPersona = await pool.request()
            .input('CodMiembro', sql.Int, login.cod)
            .output('return_value', sql.Int, 0)
            .execute('');
        return edtPersona.output;
    }
    catch (err) {
        console.log(err);
        return 0;

    }
}


//usuariosDelete
const usuariosDelete = async (id_User) => {
    try {

        let pool = await sql.connect(conexion);
        let salida = await pool.request()
            .input('CodMiembro', sql.Int, id_User.id)
            .input('IdUsuario', sql.Int, id_User.idUser)
            .input('FisicoDell', sql.Int, id_User.operacion)
            .output('return_value', sql.Int, 0)
            .execute('')
        return salida.output;
    } catch (err) {
        console.log(err);
        return 0;
    }
}





module.exports = {
    usuariosGet,
    usuarioGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuarioRolModulos,
};