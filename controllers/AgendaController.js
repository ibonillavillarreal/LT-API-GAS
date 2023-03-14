
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
const PDFDocument = require('pdfkit');
const stream = require('./stream');
const blobStream = require('blob-stream');
const getStream = require('get-stream');

const fs = require('fs');

const imprimir = async (req, res, next) => {
  try {
    let params_id = req.params.id;    
    console.log('la Data de params_id : ' + JSON.stringify(params_id));

    ///Create a document              
    var Doc = new PDFDocument({ bufferPages: true });
    const stream = Doc.pipe(blobStream());
    let buffers = [];
    Doc.on('data', buffers.push.bind(buffers));
    Doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=test.pdf',
      }).end(pdfData);
    });

    Doc.font('Times-Roman')
      .fontSize(12).text(` Este es el texto de prueba `, 50, 50);
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

