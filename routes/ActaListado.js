
const ActaController =  require('../controllers/ActaController');
const router= require('express').Router();
  
router.get('/',ActaController.getActaListado);  
// router.get('/:id',ActaController.getAgendaId); 
// router.post('/',ActaController.add_Agenda);  
// router.put('/',ActaController.EditAgenda);
// router.get('/get/nro/',ActaController.getNroAgenda); 
// router.post('/Eliminar/',ActaController.DelEditAgenda);  
// router.get('/imprimir/print/:id',ActaController.imprimir);  

module.exports=router;
