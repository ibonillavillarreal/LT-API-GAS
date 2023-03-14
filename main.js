var express = require('express')
var cors = require('cors')
var app = express();
var handleError = require('./middleware/handleError')
var Router =  require('./routes/Index');
require('dotenv').config()
const porPORTmain = process.env.PORTmain || 4800;

// constructor use app
app.use(cors());

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

app.use(express.json());
app.use('/API',Router);
app.use(handleError); //manejo de error status async

// lanzar al puerto 
app.listen(porPORTmain, ()=>{
  console.log(` 🚀 Server API is running 🏍⛽ on port ${porPORTmain}`);
});

