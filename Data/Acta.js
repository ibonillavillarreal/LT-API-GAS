
"use strict"

const sql = require('mssql')
const DICTIONARY_KEYS = require('../Utils/DICTIONARY_KEYS')
require('dotenv').config()
const conexion = require('../config/conexion');
const { path } = require('pdfkit');
const { time } = require('console');



const postgetPuntosDeAgenda = async (json_Cod_Agenda) => {
  try {

    let CodAgenda = json_Cod_Agenda.Cod_Agenda;

    let mssql = await sql.connect(conexion);
    let data = await mssql.request()
      .input('CodAgenda', sql.Int, CodAgenda)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbAgendaDetalles')

    return data.recordset;

  } catch (err) {
    console.log(err);
  }

}


const Add_Json_Acta = async (json_Cod_Acta) => {
  console.log('llegando a controlador : ' + JSON.stringify(json_Cod_Acta));
  try {
    let Acta_Maestro = json_Cod_Acta.Acta_ful.Acta_Maestro;
    let elCodActa = Acta_Maestro.CodActas;

    let mssql = await sql.connect(conexion);
    let data = await mssql.request()
      .input('CodActas', sql.Int, elCodActa)
      .input('CodAgenda', sql.Int, Acta_Maestro.CodAgenda)
      .input('IdSesion', sql.NVarChar, Acta_Maestro.IdSesion)
      .input('TipoSesion', sql.Int, Acta_Maestro.TipoSesion)
      .input('IdActaMembrete', sql.Int, 49)
      .input('Hora', sql.NVarChar, Acta_Maestro.Hora)
      .input('Local', sql.NVarChar, Acta_Maestro.Local)
      .input('ActaDedicatoria', sql.NVarChar, Acta_Maestro.ActaDedicatoria)
      .input('FechaSesion', sql.Date, Acta_Maestro.FechaSesion)
      .input('EstadoActaX100', sql.Float, 0)
      .execute('Legales.p_SavetbActas')
    let newCodActa = data.returnValue;

    let Acta_Detalle = json_Cod_Acta.Acta_ful.Acta_Detalle;
    let ultimoDetalle;
    Acta_Detalle.forEach(tbAcuerdos => {
      console.log('Cod para detalle ',JSON.stringify(elCodActa));
      let retorno_DetalleAcuerdos = mssql.request()
        .input('CodAcuerdo', sql.Int, tbAcuerdos.CodAcuerdo)
        .input('CodActa', sql.Int,(elCodActa==0)?newCodActa:elCodActa)
        .input('CodAgendaDetalles', sql.Int, tbAcuerdos.CodAgendaDetalles)
        .input('IdAcuerdos', sql.NVarChar, tbAcuerdos.IdAcuerdos)
        .input('Acuerdos', sql.NVarChar, tbAcuerdos.Acuerdos)
        .input('AudioAcuerdo', sql.NVarChar, tbAcuerdos.AudioAcuerdo)
        .input('EstadoAcuerdo', sql.Int, 1)
        .input('FechaRegistro', sql.Date, tbAcuerdos.FechaRegistro)
        .input('EstadoRegistro', sql.Int, 1)
        .input('IdUsuario', sql.Int, 1)
        .input('Operacion', sql.Int, 1)
        .execute('Legales.p_SavetbAcuerdos')
      ultimoDetalle = retorno_DetalleAcuerdos.returnValue
    });

    return newCodActa;
  } catch (err) {
    console.log(err);
  }

}

/***** */
const Add_Json_LazaActa = async (json_Cod_Acta) => {
  console.log('Generando Acta : ' + JSON.stringify(json_Cod_Acta));
  try {
    let Acta_Maestro = json_Cod_Acta; //.Acta_ful; //.Acta_Maestro;

    let mssql = await sql.connect(conexion);
    let data = await mssql.request()
      .input('CodActas', sql.Int, Acta_Maestro.CodActas)
      .input('CodAgenda', sql.Int, Acta_Maestro.CodAgenda)
      .input('IdSesion', sql.NVarChar, Acta_Maestro.IdSesion)
      .input('TipoSesion', sql.Int, Acta_Maestro.TipoSesion)
      .input('IdActaMembrete', sql.Int, 49)
      .input('Hora', sql.NVarChar, Acta_Maestro.Hora)
      .input('Local', sql.NVarChar, Acta_Maestro.Local)
      .input('ActaDedicatoria', sql.NVarChar, Acta_Maestro.ActaDedicatoria)
      .input('FechaSesion', sql.Date, Acta_Maestro.FechaSesion)
      .input('EstadoActaX100', sql.Float, 0)
      .execute('Legales.p_SavetbActas')
    let newCodActa = data.returnValue;
    return newCodActa;
  } catch (err) {
    console.log(err);
  }

}
/***** */

const editActaDocx = async (jsonPath) => {
  try {

    let mssql = await sql.connect(conexion);
    let UpDoc = await mssql.request()
      .input('CodActas', sql.Int, jsonPath.cod_file)
      .input('UpDoc', sql.NVarChar, jsonPath.urlFileName)
      .execute('Legales.p_SavetbActaDocx')
    return UpDoc.recordset[0].UpDoc;

  } catch (edit_err) {
    console.log(edit_err);
  }
}


const pathActaDocx = async (cod_file) => {
  try {

    let mssql = await sql.connect(conexion);
    let UpDoc = await mssql.request()
      .input('CodActas', sql.Int, cod_file)
      .input('UpDoc', sql.NVarChar, '')
      .execute('Legales.p_Gettb_pathActaDocx')
    return UpDoc.recordset[0].UpDoc;

  } catch (edit_err) {
    console.log(edit_err);
  }
}




const getActaListado = async () => {
  //console.log('Esta llegando a FUNCION');
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('CodActas', sql.Int, 0)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbActas')
    return salida.recordsets;

  } catch (e) {
    console.log(e)
    return "0";
  }
}


const getNroActa = async () => {
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .execute('Legales.p_GetNroDeActas')
    return salida.recordsets;

  } catch (e) {
    console.log(e)
    return "0";
  }
}


const getNroIdAcuerdo = async () => {
  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .execute('Legales.p_GetNroIdAcuerdo')

    //console.log('data salida : '+JSON.stringify(salida.recordset[0].newNroIdAcuerdo))   
    return salida.recordset[0].newNroIdAcuerdo;

  } catch (e) {
    console.log(e)
    return "0";
  }
}


const getActaDetalleId = async (id) => {
  try {
    let maestro;
    console.log('Id valor CodActa : ' + JSON.stringify(id));

    let mssql = await sql.connect(conexion);
    let salida_maestro = await mssql.request()
      .input('CodActa', sql.Int, id)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbAcuerdos');
    maestro = salida_maestro.recordsets[0];

    return maestro
  } catch (e) {
    console.log(e)
  }
}



const getAgendaActa = async () => {
  // console.log('Esta llegando a getAgendaActa');

  try {
    let mssql = await sql.connect(conexion);
    let salida = await mssql.request()
      .input('CodAgenda', sql.Int, 0)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GetAgendaActa')
    return salida.recordsets;


  } catch (e) {
    console.log(e)
    return "0";
  }
}




const DelEditAgenda = async (obj) => {
  try {
    let pool = await sql.connect(conexion);
    let salida = await pool.request()
      .input('CodAgenda', sql.Int, obj.CodAgenda)
      .input('EstadoRegsistro', sql.Int, obj.estado)
      .input('IdUsuario', sql.Int, obj.idUser)
      .input('Operacion', sql.Int, 4)
      .execute('Legales.p_DeletetbAgendas')

    return salida.returnValue;
  } catch (err) {
    console.log(err);
    return 0;
  }
}


const imprimir = async (id) => {

  try {
    let mssql = await sql.connect(conexion);
    let salida_maestro = await mssql.request()
      .input('CodAgenda', sql.Int, id)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GettbAgendas');
    return salida_maestro.recordsets[0][0];

  } catch (err) {
    console.log(err);
    return 0;
  }
}


const getActaId = async (id) => {
  try {
    let json_Acta;
    let maestro;
    let agendaActa;
    let puntosAcuerdos;
    let agendaDedicatoria;
    let GetPuntosDeAgenda;
    let RepreClaustro;
    let firmasPresidenta;
    let firmasSecretario;

    let mssql = await sql.connect(conexion);
    let salida_maestro = await mssql.request()
      .input('CodActas', sql.Int, id)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbActas');    //p_GettbActas
    maestro = salida_maestro.recordsets[0];

    let salida_agendaActa = await mssql.request()
      .input('CodAgenda', sql.Int, maestro[0].CodAgenda)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GetAgendaActa');  //p_GetAgendaActa
    agendaActa = salida_agendaActa.recordsets[0];

    let salida_RepreClaustro = await mssql.request()
      .input('CodAgenda', sql.Int, maestro[0].CodAgenda)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GetRepreClaustro');  //p_GetRepreClaustro 
    RepreClaustro = salida_RepreClaustro.recordsets[0];

    let salida_agendaDedicatoria = await mssql.request()
      .input('CodAgenda', sql.Int, maestro[0].CodAgenda)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GetDedicatoriaAgendaActa');  //p_GetDedicatoriaAgendaActa
    agendaDedicatoria = salida_agendaDedicatoria.recordsets[0];

    let salida_GetPuntosDeAgenda = await mssql.request()
      .input('CodAgenda', sql.Int, maestro[0].CodAgenda)
      .input('EstadoRegsistro', sql.Int, 1)
      .execute('Legales.p_GetPuntosDeAgenda');  //p_GetPuntosDeAgenda
    GetPuntosDeAgenda = salida_GetPuntosDeAgenda.recordsets[0];


    let salida_acuerdos = await mssql.request()
      .input('CodActa', sql.Int, id)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('Legales.p_GettbAcuerdos');  //p_GettbAcuerdos
    puntosAcuerdos = salida_acuerdos.recordsets[0];

    let salida_firmasPresidenta = await mssql.request()
      .input('CodMiembro', sql.Int, 8)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('RRHH.p_GetFirmas');  //p_GetFirmas
    firmasPresidenta = salida_firmasPresidenta.recordsets[0];


    let salida_firmasSecretario = await mssql.request()
      .input('CodMiembro', sql.Int, 9)
      .input('EstadoRegistro', sql.Int, 1)
      .execute('RRHH.p_GetFirmas');  //p_GetFirmas
    firmasSecretario = salida_firmasSecretario.recordsets[0];

    json_Acta = {
      Maestro: maestro, agendaActa: agendaActa, puntosAcuerdos: puntosAcuerdos,
      AgendaDedicatoria: agendaDedicatoria, GetPuntosDeAgenda: GetPuntosDeAgenda,
      RepreClaustro: RepreClaustro, firmasPresidenta: firmasPresidenta, firmasSecretario: firmasSecretario
    }

    return json_Acta
  } catch (e) {
    console.log(e)
  }
}


//*************************************** class tablas ******************************************/
// Import dependencies pdfKit
const PDFDocument = require("pdfkit");
//
class PDFDocumentWithTables extends PDFDocument {
  constructor(options) {
    super(options);
  }

  table(table, arg0, arg1, arg2) {
    let startX = this.page.margins.left, startY = this.y;
    let options = {};

    if ((typeof arg0 === "number") && (typeof arg1 === "number")) {
      startX = arg0;
      startY = arg1;

      if (typeof arg2 === "object")
        options = arg2;
    } else if (typeof arg0 === "object") {
      options = arg0;
    }

    const columnCount = table.headers.length;
    const columnSpacing = options.columnSpacing || 15;
    const rowSpacing = options.rowSpacing || 5;
    const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

    const prepareHeader = options.prepareHeader || (() => { });
    const prepareRow = options.prepareRow || (() => { });
    const computeRowHeight = (row) => {
      let result = 0;

      row.forEach((cell) => {
        const cellHeight = this.heightOfString(cell, {
          width: columnWidth,
          align: "left"
        });
        result = Math.max(result, cellHeight);
      });

      return result + rowSpacing;
    };

    const columnContainerWidth = usableWidth / columnCount;
    const columnWidth = columnContainerWidth - columnSpacing;
    const maxY = this.page.height - this.page.margins.bottom;

    let rowBottomY = 0;

    this.on("pageAdded", () => {
      startY = this.page.margins.top;
      rowBottomY = 0;
    });

    // Allow the user to override style for headers
    prepareHeader();

    // Check to have enough room for header and first rows
    if (startY + 3 * computeRowHeight(table.headers) > maxY)
      this.addPage();

    // Print all headers
    table.headers.forEach((header, i) => {
      this.font("Courier-Bold").fontSize(10).text(header, startX + i * columnContainerWidth, startY, {
        width: columnWidth,
        align: "left"
      });
    });

    // Refresh the y coordinate of the bottom of the headers row
    rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

    // Separation line between headers and rows
    this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
      .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
      .lineWidth(2)
      .stroke();

    table.rows.forEach((row, i) => {
      const rowHeight = computeRowHeight(row);

      // Switch to next page if we cannot go any further because the space is over.
      // For safety, consider 3 rows margin instead of just one
      if (startY + 3 * rowHeight < maxY)
        startY = rowBottomY + rowSpacing;
      else
        this.addPage();

      // Allow the user to override style for rows
      prepareRow(row, i);

      // Print all cells of the current row
      row.forEach((cell, i) => {
        this.text(cell, startX + i * columnContainerWidth, startY, {
          width: columnWidth,
          align: "left"
        });
      });

      // Refresh the y coordinate of the bottom of this row
      rowBottomY = Math.max(startY + rowHeight, rowBottomY);

      // Separation line between rows
      this.moveTo(startX, rowBottomY - rowSpacing * 0.3)
        .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.3)
        .lineWidth(1)
        .opacity(0.7)
        .stroke()
        .opacity(1); // Reset opacity after drawing the line
    });

    this.x = startX;
    this.moveDown();

    return this;
  }
}



module.exports = {
  getActaDetalleId: getActaDetalleId,
  getActaListado: getActaListado,
  getNroActa: getNroActa,
  getNroIdAcuerdo,
  getAgendaActa,
  postgetPuntosDeAgenda: postgetPuntosDeAgenda,
  Add_Json_Acta: Add_Json_Acta,
  Add_Json_LazaActa:Add_Json_LazaActa,
  editActaDocx,
  pathActaDocx,
  imprimir: imprimir,
  getActaId: getActaId,
  DelEditAgenda: DelEditAgenda,
  PDFDocumentWithTables
};

