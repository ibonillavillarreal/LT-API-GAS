


const DBAgendas = require('../Data/Agendas');


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

  console.log(' llegando al controlador ')
  try {
    let json_id = { ...request.body }
    //let data = await DBAgendas.DelEditAgenda(json_id)
    return 1;  //response.json(data);
  } catch (error) {
    next(error)
  }
}



module.exports = {
  getAgendaId: getAgendaId,
  getAgenda: getAgenda,
  getNroAgenda: getNroAgenda,
  add_Agenda: add_Agenda,
  EditAgenda: EditAgenda,
  DelEditAgenda:DelEditAgenda
};

