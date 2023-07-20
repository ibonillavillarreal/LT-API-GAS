
const AgendaController= require('../controllers/AgendaController');

const router = require('express').Router();

  
router.get('/',AgendaController.getAgenda);  
router.get('/:id',AgendaController.getAgendaId); 
router.post('/',AgendaController.add_Agenda);  
router.put('/',AgendaController.EditAgenda);
router.get('/get/nro/',AgendaController.getNroAgenda); 
router.post('/Eliminar/',AgendaController.DelEditAgenda);  
router.get('/imprimir/print/:id',AgendaController.imprimir);  
router.get('/Local/Institucion/',AgendaController.getInstitucion);  
router.get('/Local/Consejo/',AgendaController.getConsejo);  


module.exports = router;
