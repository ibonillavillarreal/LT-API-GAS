

///////////// Modulos //////////////////////////////
const DBAgendas = require('../Data/Agendas');
////////////////////////////////////////////////////


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

//getInstitucion
const getInstitucion = async (request, response, next) => {
  try {
    DBAgendas.getInstitucion().then((data) => {     
      //console.log('instituciones : ' + JSON.stringify(data));
      response.json(data);
       
    })
  } catch (ex) {
    next(ex)
  }

}

//getConsejo
const getConsejo = async (request, response, next) => {
  try {
    //console.log('getConsejo : ' );          
       DBAgendas.getConsejo().then((data) => {               
      response.json(data);       
     })
  } catch (ex) {
    next(ex)
  }

}


const add_Agenda = async (request, response, next) => {
  try {
    let Agenda = {...request.body}.RegistroCompleto_json;
    let data = await DBAgendas.add_Agenda(Agenda)
    return response.json(data);
  } catch (error) {
    next(error)
  }
}

const EditAgenda = async (request, response, next) => {
  try {
    let Agenda = {...request.body}.RegistroCompleto_json
    let data = await DBAgendas.editAgenda(Agenda)
    return response.json(data);
  } catch (error) {
    next(error)
  }
}

const DelEditAgenda = async (request, response, next) => {

  try {
    let json_id = {...request.body}.i
    let data = await DBAgendas.DelEditAgenda(json_id)
    response.json(data);
  } catch (error) {
    next(error)
  }
}


////////////////////////////////////////////////////////////////
const PDFDocument = require('pdfkit-construct');
const stream = require('./stream');
const getStream = require('get-stream');
const fs = require('fs');
const { json } = require('body-parser');

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
    
    
    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const dia =  (strAgenda_Completa.Maestro[0].FechaRegSistema).getDate()+1;    
    const mes =  (strAgenda_Completa.Maestro[0].FechaRegSistema).getMonth();    
    const anio = (strAgenda_Completa.Maestro[0].FechaRegSistema).getFullYear();    
    const FechaRegSistema = dia +" DE "+ meses[mes] +" DEL "+ anio ; 
    
    const r_dia = (strAgenda_Completa.Maestro[0].FechaRegristro).getDate()+1;
    const r_mes = (strAgenda_Completa.Maestro[0].FechaRegristro).getMonth();
    const r_anio =(strAgenda_Completa.Maestro[0].FechaRegristro).getFullYear();
    const FechaRegristro = r_dia +" DE "+ meses[r_mes] +" DEL "+ r_anio ; 
    
    const Hora = (strAgenda_Completa.Maestro[0].Hora);
    //console.log('la Hora : '+ JSON.stringify(strAgenda_Completa.Maestro[0]));
    
    
    ////  GOTO : dirtecciones 
    let X = 60;
    let Y = 160;
    let SESION =``
    if (1){SESION =`SESIÓN EXTRAORDINARIA`}else{SESION =`SESIÓN ORDINARIA`}

    //// Pintar la data   
    Doc.image('./rept/logo-cnu.png', X, 45, { fit: [190, 190] }).stroke();
    Doc.font('Times-Bold').fontSize(18).text('C O N V O C A T O R I A', X, Y, { width: 500, align: 'center' });
    Doc.font('Times-Bold').fontSize(13).text('A :', X, Y + 30, { width: 400, align: 'left' });
    Doc.font('Times-Bold').fontSize(13).text('Miembros del Consejo Nacional de Universidades', X + 60, Y + 30, { width: 400, align: 'left' });
    Doc.font('Times-Bold').fontSize(13).text('De:', X, Y + 60, { width: 400, align: 'left' });
    Doc.font('Times-Bold').fontSize(13).text('Roberto Enrique Flores Días', X + 60, Y + 60, { width: 400, align: 'left' });
    Doc.font('Times-Bold').fontSize(13).text('Secretario del CNU', X + 90, Y + 75, { width: 400, align: 'left' });
    Doc.moveTo(X + 200, Y + 85).lineTo(X + 200, Y + 85).lineTo(X + 350, Y + 85).stroke();
    Doc.font('Times-Bold').fontSize(13).text('Ref:', X, Y + 115, { width: 400, align: 'left' });
    Doc.font('Times-Bold').fontSize(13).text(`${SESION} No. ${IdAgenda}`, X + 60, Y + 115, { width: 400, });
    Doc.moveTo(X + 50, Y + 126).lineTo(X + 50, Y + 126).lineTo(X + 310, Y + 126).stroke();
    Doc.font('Times-Bold').fontSize(13).text('FECHA:', X, Y + 140, { width: 400, align: 'left' });
    Doc.font('Times-BoldItalic').fontSize(13).text(`${FechaRegSistema}`, X + 60, Y + 140, { width: 400, align: 'left'});
    Doc.font('Times-Bold').fontSize(13)
      .text('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * * * * * *'
        , X, Y + 155, { width: 500, align: 'left' });

    let strbody = "Estimados(as) miembros del Consejo Nacional de Universidades, Doctora Ramona Rodríguez Pérez, ";
    strbody += `atenta y respetuosamente, se convoca a los honorables miembros a ${SESION} No. ${IdAgenda}, ` ;
    strbody += "del Consejo Nacional de Universidades, la que se realizará segun detalle";
    Doc.font('Times-Roman').fontSize(13).text(`${strbody}`, X, Y + 170, { width: 500, align: 'justify' });

    //fecha  - hora - local  
    const strLocal = JSON.stringify(strAgenda_Completa.Maestro[0].LOCAL);
    Doc.font('Times-Roman').fontSize(13).text("Fecha:", X, Y + 240);
    Doc.font('Times-Roman').fontSize(13).text(`${FechaRegristro}`, X + 60, Y + 240);
    Doc.font('Times-Roman').fontSize(13).text("Hora:", X, Y + 255);
    Doc.font('Times-Roman').fontSize(13).text(`${Hora} H`, X + 60, Y + 255);
    Doc.font('Times-Roman').fontSize(13).text("Local:", X, Y + 270);
    Doc.font('Times-Roman').fontSize(13).text(`${strLocal}`, X + 60, Y + 270);


    //Agenda de la Sesion  - Tabla [] puntosAgenda       
    const table = { title: '', headers: ['Puntos'], rows: [] }
    Doc.font('Times-Bold').fontSize(13).text('AGENDA DE LA SESIÓN', X, Y + 305, { width: 500 });
    Doc.moveTo(X, Y + 315).lineTo(X, Y + 315).lineTo(X + 150, Y + 315).stroke();

    let f = 0; //ForEach
    strAgenda_Completa.PuntosDeAgenda.forEach(fila => {
      const tmp = fila.PuntosAgenda;
      const reg = tmp.replace(/"/g, "").replace(/[\t\n]/g, '');
      Doc.font('Times-Roman').fontSize(13).text(reg, X, Y + 330 + f, { width: 500, align: 'left' });

      f = f + 15 + (Math.round(((JSON.stringify(fila.PuntosAgenda).length) / 200)) * 15);
    });

    Y = Y + f; // actualiz a Y   
       
    // const tb_pAgenda =[];
    // strAgenda_Completa.PuntosDeAgenda.forEach(element => {
    //   tb_pAgenda.push({'puntoAgenda':JSON.stringify(element.PuntosAgenda)})
    // });
    //   Doc.addTable(
    //     [{ key: 'puntoAgenda', label: 'AGENDA DE LA SESIÓN', align: 'left' }],
    //     tb_pAgenda,
    //     {
    //       border: null,
    //       width: "fill_body",
    //       striped: true,
    //       stripedColors: ["#f6f6f6", "#d6c4dd"],
    //       cellsPadding: 10,
    //       marginLeft: 45,
    //       marginRight: 45,
    //       headAlign: 'left'
    //     });
    //   Doc.render();

    //El footers
    Doc.font('Times-Roman').fontSize(13).text('Seguros de contar con su puntual asistencia.', X, Y + 370);
    Doc.font('Times-Bold').fontSize(13)
      .text('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * * * * * *'
        , X, Y + 395, { width: 500, align: 'left' });


    //bit-Footer    
    Doc.image('./rept/bit-Foother.png', X, Y + 420, { fit: [500, 300] }).stroke();      
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
  getInstitucion:getInstitucion,
  getConsejo:getConsejo,
  add_Agenda: add_Agenda,
  EditAgenda: EditAgenda,
  imprimir: imprimir,
  DelEditAgenda: DelEditAgenda
};

