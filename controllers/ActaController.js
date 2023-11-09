

///////////// Modulos //////////////////////////////
const DBActas = require('../Data/Acta');
////////////////////////////////////////////////////


const getActaListado = async (request, response, next) => {

  try {
    DBActas.getActaListado().then((data) => {
      response.json(data[0]);
    })
  } catch (ex) {
    next(ex)
  }
}

const getActaDetalle = async (request, response, next) => {
  try {

    DBActas.getActaDetalleId(request.params.id).then((data) => {
      response.json(data);
    })
  } catch (ex) {
    next(ex)
  }

}


const getNroActa = async (request, response, next) => {

  try {
    DBActas.getNroActa().then((data) => {
      response.json(data[0][0].newNroIdActa);
    })
  } catch (ex) {
    next(ex)
  }
}

const getNroIdAcuerdo = async (request, response, next) => {

  try {

    DBActas.getNroIdAcuerdo().then((data) => {
      response.json(data);
    })
  } catch (ex) {
    next(ex)
  }
}

const getAgendaActa = async (request, response, next) => {

  try {
    DBActas.getAgendaActa().then((data) => {
      response.json(data[0]);
    })
  } catch (ex) {
    next(ex)
  }
}

const postgetPuntosDeAgenda = async (request, response, next) => {
  try {
    let CodAgenda = { ...request.body };
    let data = await DBActas.postgetPuntosDeAgenda(CodAgenda);
    return response.json(data);
  } catch (error) {
    next(error)
  }
}



const Add_Json_Acta = async (request, response, next) => {
   //console.log('llegando a controlador : ' + JSON.stringify(request.body));  
  try {
    let CodActa = { ...request.body };
    let data = await DBActas.Add_Json_Acta(CodActa);
    return response.json(data);
  } catch (error) {
    next(error)
  }
}


const path = require('path');
const subir = async (request, response, next) => {
  try {

    const cod_file = request.file.filename.split('.')[0].substring(12);
    const urlFileName = 'D:/ProyectoCNU-cli/zSubidas/' + request.file.filename;
    jsonPath = { cod_file, urlFileName }
    let Url_Data = await DBActas.editActaDocx(jsonPath)

    return response.json(Url_Data);
  } catch (error) {
    next(error)
  }
}


const download = async (request, response, next) => {
  const cod_acta = request.body.filename;
  const directoryPath = path.join('D:/ProyectoCNU-cli/zSubidas/UpDocCodActa') + cod_acta + '.docx';
  const path_dbData = await DBActas.pathActaDocx(cod_acta)   //extraer el path

  //console.log('data directoryPath : ' + JSON.stringify(directoryPath));
  //console.log('data path_dbData : ' + JSON.stringify(path_dbData));

  return response.sendFile(path_dbData);
};


const DelEditAgenda = async (request, response, next) => {
  try {
    let json_id = { ...request.body }
    let data = await DBActas.DelEditAgenda(json_id)
    response.json(data);
  } catch (error) {
    next(error)
  }
}



////////////////////////////////////////////////////////////////
const PDFDocument = require('pdfkit-table', 'pdfkit-construct');
const stream = require('./stream');
const getStream = require('get-stream');
const { stringify } = require('querystring');
const { columns } = require('mssql');
const { options, font, underline } = require('pdfkit');


/* class tabla impoprtamos */
// const PDFDocumentClass = DBActas.PDFDocumentClass;
const imprimir = async (req, res, next) => {
  try {

    ///Create a document  Doc Pdf             
    let buffers = [];
    var Doc = new PDFDocument({
      bufferPages: true, font: 'Courier', size: 'letter',
      margins: { top: 30, bottom: 50, left: 50, right: 50 }
    });
    Doc.on('data', buffers.push.bind(buffers));
    Doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;',
      }).end(pdfData);
    });

    //// Extraccion de la data   //const strAgenda_Maestro = JSON.stringify(await DBAgendas.imprimir(params_id));
    let params_id = req.params.id;
    const strActa_Completa = await DBActas.getActaId(params_id);
    //console.log('Data strActa_Completa   : ' + JSON.stringify(strActa_Completa));

    const IdActaSesion = strActa_Completa.Maestro[0].IdSesion;
    const TipoSesion = strActa_Completa.Maestro[0].TipoSesion;

    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const dia = (strActa_Completa.Maestro[0].FechaRegistro).getDate() + 1;
    const mes = (strActa_Completa.Maestro[0].FechaRegistro).getMonth();
    const anio = (strActa_Completa.Maestro[0].FechaRegistro).getFullYear();
    const FechaRegSistema = dia + " DE " + meses[mes] + ", " + anio;

    const strFechaSesion = new Date(strActa_Completa.Maestro[0].FechaSesion);
    const r_dia = strFechaSesion.getDate() + 1;
    const r_mes = strFechaSesion.getMonth();
    const r_anio = strFechaSesion.getFullYear();
    const FechaSesion = r_dia + " DE " + meses[r_mes] + ", " + r_anio;
    const Hora = (strActa_Completa.Maestro[0].Hora) + ' Horas';
    const Local = (strActa_Completa.Maestro[0].Local);

    //-------------------------------------------------------------------------------------//  
    ////  GOTO : direcciones del logo cnu 
    let Xi = 200;
    let Yi = 30;
    let MEMBRETE = `ACTA DE ACUERDOS DEL CONSEJO NACIONAL DE UNIVERSIDADES`
    let SESION = ``
    if (TipoSesion === 'Ordinaria') { SESION = `SESIÓN ORDINARIA` }
    else if (TipoSesion === 'Extra-Ordinaria') { SESION = `SESIÓN EXTRAORDINARIA` }
    else if (TipoSesion === 'Ordinaria-Virtual') { SESION = `SESIÓN ORDINARIA VIRTUAL` }
    else { SESION = `SESIÓN EXTRAORDINARIA VIRTUAL` }

    /////// Pintar EL MEMBRETE   
    Doc.image('./rept/logo-cnu.png', Xi, Yi, { align: 'center', fit: [180, 180], }).stroke();
    Doc.fill("#000000").font('Times-Bold').fontSize(11).text(MEMBRETE, Xi - 160, Yi + 80, { width: 500, align: 'center' });
    Doc.fill("#000000").font('Times-Bold').fontSize(11).text(SESION + ' No. ' + IdActaSesion + ', DEL ' + FechaSesion, Xi - 160, Yi + 100, { width: 500, align: 'center' });


    //-------------------------------------------------------------------------------------//  
    ////  GOTO : Direcciones de la Cabecera 
    ////  Pintar INICIO Y DEDICATORAS             
    let X = 50;
    let Y = 165;
    if (TipoSesion === 'Ordinaria-Virtual') {
      Doc.font('Times-Bold').fontSize(12).text('Inicio : ' + Hora, X, Y, { width: 400, align: 'left' });
      Doc.font('Times-Bold').fontSize(12).text('Local  : ' + 'Por llamada Zoom', X, Y + 20, { width: 400, align: 'left' });
    } else if (TipoSesion === 'Extra-Ordinaria-Virtual') {
      Doc.font('Times-Bold').fontSize(12).text('Inicio : ' + Hora, X, Y, { width: 400, align: 'left' });
      Doc.font('Times-Bold').fontSize(12).text('Local  : ' + 'Por llamada Zoom', X, Y + 20, { width: 400, align: 'left' });
    } else {
      Doc.font('Times-Bold').fontSize(12).text('Inicio : ' + Hora, X, Y, { width: 400, align: 'left' });
      Doc.font('Times-Bold').fontSize(12).text('Local  : ' + Local, X, Y + 20, { width: 400, align: 'left' });
    }


    //-------------------------------------------------------------------------------------//  
    ////  GOTO : Direcciones del Cuerpo
    let Xc = 50;
    let Yc = 215;
    let contador_YC = 0;

    Doc.font('Times-Bold').fontSize(12)
      .text('Dedicatoria :', Xc, Yc, { width: 400, align: 'left', underline: true });
    Yc = Yc + 15;
    //// Dedicatorias filas
    contador_YC = 0;
    const ActaDedicatoria = strActa_Completa.Maestro;  //ActaDedicatoria    
    ActaDedicatoria.forEach(reg => {
      Doc.font('Times-Roman').fontSize(13)
         .text(reg.ActaDedicatoria, Xc, Yc, { width: 400, align: 'left' });
        });
    const nfilas = ActaDedicatoria[0].ActaDedicatoria.split(/\n/);
    contador_YC = contador_YC + (nfilas.length * 15);
    Yc = Yc + contador_YC;
    Doc.fontSize(12).text(' ', Xc, Yc, { width: 400, align: 'left' });


    //-------------------------------------------------------------------------------------//  
    //// Asistencia miemmbros                         
    //Tabla de : ASISTENCIAS           
    contador_YC = 0;
    const RepreClaustro = strActa_Completa.RepreClaustro;  //RepreClaustro        
    const table = { headers: ['Asistencia miembros del CNU:'], rows: [] };
    RepreClaustro.forEach(miembro => {
      table.rows.push([miembro.CodGradoAcademico + ' ' + miembro.Nombre + ' ' + miembro.TxtCodClaustro]);
      contador_YC = contador_YC + 40;
    });
    Doc.table(table,
      {
        prepareHeader: () => { Doc.font("Times-Bold").fontSize(13), 'padding:5' },
        prepareRow: () => { Doc.font("Times-Roman").fontSize(13) },
        width: 500, columnsSize: [500],
      });
    //console.log('Filas rows : '+ ((table.rows.length + 2) *20));
    Yc = Yc + ((table.rows.length + 2) * 20);    
    Doc.fontSize(12).text('  ', Xc, Yc, { width: 400, align: 'left' });

    //-------------------------------------------------------------------------------------//  
    //// PUNTOS E DAGENDA   **     const docTabla = new DBActas.PDFDocumentWithTables();        
    // Tabla de :  PUNTOS DE AGENDA    
    contador_YC = 0;
    const GetPuntosDeAgenda = strActa_Completa.GetPuntosDeAgenda;  //GetPuntosDeAgenda    
    const tablePuntosDeAgenda = { headers: ['Puntos de Agenda:'], rows: [] };
    GetPuntosDeAgenda.forEach(miembro => {
      tablePuntosDeAgenda.rows.push([miembro.PuntosAgenda]);
      //console.log('fila : ' + JSON.stringify(miembro.PuntosAgenda));
      if (miembro.PuntosAgenda.length > 100) {
        const strfilPuntos = Math.round(miembro.PuntosAgenda.length / 100);
        contador_YC = contador_YC + (strfilPuntos * 30);
        //console.log('strfilPuntos.length : ' + strfilPuntos);
      } else {
        contador_YC = contador_YC + 30;
      }

    });
    Doc.table(tablePuntosDeAgenda,
      {
        prepareHeader: () => { Doc.font("Times-Bold").fontSize(12), 'padding:5' },
        prepareRow: () => { Doc.font("Times-Roman").fontSize(13) },
        width: 500, columnsSize: [500], border: null,
      });
    //Yc = Yc + contador_YC;
    Yc = Yc + ((tablePuntosDeAgenda.rows.length + 2) * 20);    
    Doc.fontSize(12).text(' ', Xc, Yc, { width: 400, align: 'left' });

    //-------------------------------------------------------------------------------------//  
    //Doc.font('Times-Bold').fontSize(12).text('Acuerdos: ', Xc, Yc, { width: 400, align: 'left', underline: true });
    contador_YC = 0;
    const puntosAcuerdos = strActa_Completa.puntosAcuerdos;  //puntosAcuerdos    
    const tablepuntosAcuerdos = { headers: ['Acuerdos:'], rows: [] };
    puntosAcuerdos.forEach(miembro => {
      tablepuntosAcuerdos.rows.push([miembro.IdAcuerdos + ' : ' + miembro.Acuerdos]);
      contador_YC = contador_YC + 40;
    });
    Doc.table(tablepuntosAcuerdos,
      {
        prepareHeader: (row, indexColumn, indexRow, rectRow) => { Doc.font("Times-Bold").fontSize(12) },
        prepareRow: (row, indexColumn, indexRow, rectRow) => { Doc.font("Times-Roman").fontSize(12) },
        width: 500, columnsSize: [500], border: null
      });

    //Yc = Yc + contador_YC;
    Yc = Yc + ((tablepuntosAcuerdos.rows.length + 2) * 20);    
    Doc.fontSize(12).text('', Xc, Yc, { width: 400, align: 'left' });

    //-------------------------------------------------------------------------------------//  
    ////// las Firmas del Acta     
    const firmasPresidenta = strActa_Completa.firmasPresidenta[0].CodGradoAcademico
      + '.' + strActa_Completa.firmasPresidenta[0].NombreCompleto;  //firmasPresidenta    
    const firmasSecretario = strActa_Completa.firmasSecretario[0].CodGradoAcademico
      + '.' + strActa_Completa.firmasSecretario[0].NombreCompleto;  //firmasSecretario    

    contador_YC = 30;
    Yc = Yc + contador_YC;
    Doc.font('Times-Bold').fontSize(12).text('______________________________', Xc, Yc, { width: 500, align: 'left' });
    Doc.font('Times-Bold').fontSize(12).text('______________________________', Xc + 300, Yc, { width: 500, align: 'left' });
    contador_YC = 15;
    Yc = Yc + contador_YC;
    Doc.font('Times-Bold').fontSize(12).text(firmasPresidenta, Xc, Yc + 10, { width: 500, align: 'left' });
    Doc.font('Times-Bold').fontSize(12).text(firmasSecretario, Xc + 300, Yc + 10, { width: 500, align: 'left' });

    //-------------------------------------------------------------------------------------//  
    ///////bit-Footer      
    contador_YC = 30;
    Yc = Yc + contador_YC;
    Doc.font('Courier-BoldOblique').fontSize(8).text('Cc.: Presidenta del CNU', Xc, Yc=Yc+10, { width: 400, align:'left'});
    Doc.font('Courier-BoldOblique').fontSize(8).text('Secretario Técnico del CNU', Xc, Yc=Yc+10, { width: 400, align:'left'});
    Doc.font('Courier-BoldOblique').fontSize(8).text('Archivo /REFD mlbm.*', Xc, Yc=Yc+10, { width: 400, align: 'left'});
    Doc.font('Courier-BoldOblique').fontSize(8).text('Tels: (505) 2266-2807, 2266-2835, 2266-9472, 2266-9467, 2266-9468', Xc, Yc=Yc+10, { width: 400, align: 'left' });
    Doc.font('Courier-BoldOblique').fontSize(8).text('Apartado Postal: Managua, Nicaragua', Xc, Yc=Yc+10, {width: 400, align: 'left'});
    
    //Doc.image('./rept/bit-Foother.png', Xc, Yc, { fit: [500, 300] }).stroke();
    //-------------------------------------------------------------------------------------//  
    /////  cierre del Doc
    Doc.end();
    const pdfStream = await getStream.buffer(Doc);
    return pdfStream;

  } catch (err) {
    console.log('error es  : ' + err);
    next(err)
  }


}


module.exports = {
  getActaDetalle: getActaDetalle,
  getActaListado: getActaListado,
  getNroActa,
  getNroIdAcuerdo,
  getAgendaActa,
  postgetPuntosDeAgenda,
  Add_Json_Acta: Add_Json_Acta,
  subir: subir,
  download: download,
  imprimir: imprimir,
  DelEditAgenda: DelEditAgenda
};

