
var express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer')



var app = express();
var cors = require('cors')
var handleError = require('./middleware/handleError')
require('dotenv').config()
var Router =  require('./routes/Index');
const porPORTmain = process.env.PORTmain || 4800;

// constructor use app


// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin', ['*']);
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');    
//     res.header('content-type','text/html');
//     res.header('content-type','text/pdf');    
//     res.header('content-type','text/csv');
//     res.header('"Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"');
//     next();
// });
  app.use(cors());
  app.use(express.json({extended:true, limit:'50mb'}));
  app.use(express.urlencoded({extended:true, limit:'50mb'}));  

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}));  

 app.use(express.json());
 app.use('/API',Router);
 app.use(handleError); //manejo de error status async

 // lanzar al puerto 
app.listen(porPORTmain, ()=>{
  console.log(` 🚀 Server API GAS - GESTION DE ACTAS => is running 🏍⛽ on port ${porPORTmain}`);
});



