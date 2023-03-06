
require('dotenv').config()
const conexion = {
    user:'sa',
    password:'123',
    database:'SIGA-CNU',
    server:'PC-BONILLA',
     options:{
         trustedconnection:false,
         enableArithAbort:true,
         encrypt:false
     }
}

const conexion2 = {
    user:'sa',
    password:'123',
    database:'SIGA-CNU',    
    server:'PC-BONILLA',
     options:{
         trustedconnection:false,
         enableArithAbort:true,
         encrypt:false
     }
}


module.exports = conexion;