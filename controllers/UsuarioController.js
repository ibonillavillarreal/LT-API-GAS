
"use strict"
const DICTIONARY_KEYS = require('../Utils/DICTIONARY_KEYS')
const conexion = require('../config/conexion');
const sql = require('mssql');
//
require('dotenv').config()
const DBLogin = require('../Data/UsuarioLogin');
//


//usuarioGet   - -  Solo un usuario
const usuarioGet = (request, response, next) => {

    try {
        let login = request.body.json_cls;
        console.log('Login llega al acontrolador '+ JSON.stringify(login));
         console.log('Usuario '+ login.user);
         console.log('Contrasenia '+ login.psw);

         DBLogin.usuarioGet(login).then((data) => {
            console.log('la data: '+ JSON.stringify(data));
            let auth = false
            
            if(data === undefined){
                auth = false;
                response.json({auth:auth,data:data,losModulos:losModulos});
            }
            else{
                DBLogin.usuarioRolModulos(data.CodUsuario).then((dataModulos) => {
                    auth = true
                    response.json({auth:auth,data:data,losModulos:dataModulos});
                });

            }
         });

    } catch (error) {
        next(error)
    }
}

//usuariosGet  - -  Lista de usuarios
const usuariosGet = (request, response, next) => {
    try {
        DBLogin.usuariosGet().then((data) => {
            response.json(data[0]);
        })
    } catch (error) {
        next(error)
    }
}

//usuariosPost
const usuariosPost = (req, res = response, next) => {
    try {
        const { user_email, user_psw } = req.body;
        res.json({ msg: 'post API - usuariosPost' });
    } catch (error) {
        next(error)
    }
}

//usuariosPut
const usuariosPut = (req, res = response, next) => {
    try {
        const { id } = req.params;
        res.json({ msg: 'put API - usuariosPut' });
    } catch (error) {
        next(error)
    }

}
//usuariosPatch
const usuariosPatch = (req, res = response) => {
    try {
        res.json({
            msg: 'patch API - usuariosPatch'
        });
    } catch (error) {
        next(error)
    }
}

//usuariosDelete
const usuariosDelete = (req, res = response) => {
    try {
        res.json({ msg: 'delete API - usuariosDelete' });
    } catch (error) {
        next(error)
    }

}

module.exports = {
    usuarioGet,
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}
