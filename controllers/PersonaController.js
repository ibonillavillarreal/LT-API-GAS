

const DBPersona = require('../Data/Persona'); 

const getPersona = async (request, response,next) => {
  try {
      DBPersona.getCliente(request.params.id).then((data) => {
      response.json(data[0]);
     })
  } catch (error) {
    next(error)
  }  
}

const getClientes = async (request, response,next) => {
    try{  

        DBPersona.getClientes().then((data) => {
        response.json(data[0]);
      })
    }catch(ex){
      next(ex)
    } 
}

const addCliente = async (request, response,next) => {
  try {
    const cliente = { ...request.body}.regPersona
    //console.log('Datos: '+ JSON.stringify(cliente))
    DBPersona.addCliente(cliente).then(data  => {
      response.json(data);
    })
    
  } catch (error) {
    next(error)      
  }
}

const editPersona = async (request, response,next) => {
  try {
    const persona = {...request.body}.regPersona    
    console.log('Data :'+JSON.stringify(persona))
    DBPersona.editPersona(persona).then(data  => {
      response.json(data);
    })
    
  } catch (error) {
    next(error)
  }
}



const getClienteEdit = async (request, response,next) => {
  try {
      const id =  request.params.id
      DBPersona.getClienteEdit(id).then((data) => {
      response.json(data[0]);
    })
  } catch (error) {
    next(error)
  }
}


const anularCliente = async (request, response,next) => {
  try {
    const id = request.params.id
    const id_User = {...request.body}.id_User
    //console.log('Datos  '+JSON.stringify(id_User))
    DBPersona.anularCliente(id_User).then(data  => {    
      response.json(data);     
    })
  } catch (error) {
    next(error)
  }
}




module.exports =  {
  getPersona: getPersona, 
  getClientes,  
  addCliente,  
  editPersona: editPersona, 
  anularCliente,    
  getClienteEdit
};
