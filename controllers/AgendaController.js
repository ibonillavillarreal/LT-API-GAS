
////
const DBAgendas = require('../Data/Agendas');
const { listeners } = require('process');
const { query } = require('express');
const { buffer } = require('stream/consumers');
const { addListener, text } = require('pdfkit');
const { default: test } = require('node:test');





const getAgenda = async (request, response, next) => {
  try {
    DBAgendas.getAgenda().then((data) => {
      response.json(data[0]);
    })
  } catch (ex) {
    next(ex)
  }
}

const getAgendaId = async (request, response, next) => {
  try {
    DBAgendas.getAgendaId(request.params.id).then((data) => {
      response.json(data);
    })
  } catch (ex) {
    next(ex)
  }

}

//getNroAgenda
const getNroAgenda = async (request, response, next) => {
  try {
    DBAgendas.getNroAgenda().then((data) => {
      response.json(data);
    })
  } catch (ex) {
    next(ex)
  }

}


const add_Agenda = async (request, response, next) => {
  try {
    let Agenda = { ...request.body };
    let data = await DBAgendas.add_Agenda(Agenda)
    return response.json(data);
  } catch (error) {
    next(error)
  }
}

const EditAgenda = async (request, response, next) => {
  try {
    let Agenda = { ...request.body }
    let data = await DBAgendas.editAgenda(Agenda)
    return response.json(data);
  } catch (error) {
    next(error)
  }
}

const DelEditAgenda = async (request, response, next) => {

  try {
    let json_id = { ...request.body }
    let data = await DBAgendas.DelEditAgenda(json_id)
    response.json(data);
  } catch (error) {
    next(error)
  }
}


////////////////////////////////////////////////////////////////
const PDFDocument = require('pdfkit-table');
const stream = require('./stream');
const getStream = require('get-stream');
const fs = require('fs');

const imprimir = async (req, res, next) => {
  try {     
    ///Create a document  Doc Pdf             
    let buffers = [];
    var Doc = new PDFDocument({ bufferPages: true, font: 'Courier' });
    Doc.on('data', buffers.push.bind(buffers));
    Doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=Agenda.pdf',
      }).end(pdfData);
    });

    //// Extraccion de la data   //const strAgenda_Maestro = JSON.stringify(await DBAgendas.imprimir(params_id));
    let params_id = req.params.id;
    const strAgenda_Completa = await DBAgendas.getAgendaId(params_id);
    const IdAgenda = strAgenda_Completa.Maestro[0].IdAgenda;
    const FechaRegSistema = strAgenda_Completa.Maestro[0].FechaRegSistema;
    const FechaRegristro = strAgenda_Completa.Maestro[0].FechaRegristro;
    
    //console.log('id agenda[0] :  '+JSON.stringify(strAgenda_Completa.Maestro[0]));        
    ////  GOTO : dirtecciones 
    let X = 60;
    let Y = 160;
    
    //// Pintar la data   
    Doc.image('./rept/logo-cnu.png', X, 45, {fit: [190, 190]}).stroke();
    Doc.font('Times-Bold').fontSize(18).text('C O N V O C A T O R I A',X,Y,{width:500,align:'center'});
    Doc.font('Times-Bold').fontSize(13).text('A :',X,Y+30,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13).text('Miembros del Consejo Nacional de Universidades',X+60,Y+30,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13).text('De:',X,Y+60,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13).text('Roberto Enrique Flores Días',X+60,Y+60,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13).text('Secretario del CNU',X+90,Y+75,{width:400,align:'left'});
    Doc.moveTo(X+200,Y+85).lineTo(X+200,Y+85).lineTo(X+350,Y+85).stroke();
    Doc.font('Times-Bold').fontSize(13).text('Ref:',X,Y+115,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13).text(`SESION EXTRAORDINARIA No. ${IdAgenda}`,X+60,Y+115,{width:400,});
    Doc.moveTo(X+50,Y+126).lineTo(X+50,Y+126).lineTo(X+310,Y+126).stroke();
    Doc.font('Times-Bold').fontSize(13).text('FECHA:',X,Y+140,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13).text(`${FechaRegSistema}`,X+60,Y+140,{width:400,align:'left'});
    Doc.font('Times-Bold').fontSize(13)
    .text('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * * * * * *'
    ,X,Y+155,{width:500,align:'left'});
    
    let strbody ="Estimados(as) miembros del Consejo Nacional de Universidades, doctora Ramona Rodríguez Pérez, ";
    strbody +="atenta y respetuosamente, se convoca a los honorables miembros a Sesión Extraordinaria No. 03-2023, ";  
    strbody +="del Consejo Nacional de Universidades, la que se realizará segun detalle";    
    Doc.font('Times-Roman').fontSize(13).text(`${strbody}`, X,Y+170,{width:500,align:'justify'});

    //fecha  - hora - local  
    const strLocal =JSON.stringify(strAgenda_Completa.Maestro[0].LOCAL);
    Doc.font('Times-Roman').fontSize(13).text("Fecha:", X,Y+240);
    Doc.font('Times-Roman').fontSize(13).text(`${FechaRegristro}`, X+60,Y+240);
    Doc.font('Times-Roman').fontSize(13).text("Hora", X,Y+255);
    Doc.font('Times-Roman').fontSize(13).text("10:30 am.", X+60,Y+255);
    Doc.font('Times-Roman').fontSize(13).text("Local:",X,Y+270);
    Doc.font('Times-Roman').fontSize(13).text(`${strLocal}`,X+60,Y+270);

    
    //Agenda de la Sesion  - Tabla [] puntosAgenda       
    const table ={title:'', headers:['Puntos'], rows:[] }  
    Doc.font('Times-Bold').fontSize(13).text('AGENDA DE LA SESIÓN',X,Y+305,{width:500});
    Doc.moveTo(X,Y+315).lineTo(X,Y+315).lineTo(X+150,Y+315).stroke();

    let f = 0; //ForEach
    strAgenda_Completa.PuntosDeAgenda.forEach(fila => {        
        const tmp =  fila.PuntosAgenda;
        const reg = tmp.replace(/"/g,"").replace(/[\t\n]/g,'');
        Doc.font('Times-Roman').fontSize(13).text(reg,X,Y+330+f,{width:500,align: 'left'});       
          
        f=f+15 + (Math.round(((JSON.stringify(fila.PuntosAgenda).length)/200))*15);
      });
      
    Y = Y + f; // actualiz a Y  


    //El footers
    Doc.font('Times-Roman').fontSize(13).text('Seguros de contar con su puntual asistencia.',X,Y+370);
    Doc.font('Times-Bold').fontSize(13)
    .text('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * * * * * *'
    ,X,Y+395,{width:500,align:'left'});
    
    //bit-Foother
    Doc.image('./rept/bit-Foother.png', X, Y+420, {fit: [500, 300]}).stroke();


    Doc.end();
    const pdfStream = await getStream.buffer(Doc);
    return pdfStream;
  } catch (err) {
    console.log('error es  : ' + err);
    next(err)
  }

}


module.exports = {
  getAgendaId: getAgendaId,
  getAgenda: getAgenda,
  getNroAgenda: getNroAgenda,
  add_Agenda: add_Agenda,
  EditAgenda: EditAgenda,
  imprimir: imprimir,
  DelEditAgenda: DelEditAgenda
};

