
const http = require('http');
const { resolve } = require('path');
const { rejects } = require('assert');


function verifyToken(req, res, next) {
    console.log('funcion de verificar')
    const tkn = req.headers['x-auth-token'];
    let data = '123';
    return new Promise((resolve, rejects) => {
        // http.get('http://xxx.xxx.yyy.zzz:3000/verify/' + tkn, (res) => {
        //     res.on('data', (chunk) => {
        //         data += chunk;
        //         if (data === 'true')
        //            next()
        //         else
        //         return false;
        //     });
        // })
            return true;       
    })
}

module.exports = {
    verifyToken: verifyToken
}