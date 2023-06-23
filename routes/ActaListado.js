
const ActaController =  require('../controllers/ActaController');
const router= require('express').Router();
  
router.get('/',ActaController.getActaListado);  
router.get('/ActaDetalle/:id',ActaController.getActaDetalle); 
router.get('/getNroActa',ActaController.getNroActa);  
router.get('/getNroIdAcuerdo',ActaController.getNroIdAcuerdo);  
router.get('/getAgendaActa',ActaController.getAgendaActa);  
router.post('/postgetPuntosDeAgenda',ActaController.postgetPuntosDeAgenda);  
router.post('/AddJsonActa',ActaController.Add_Json_Acta);  
router.get('/imprimir/print/:id',ActaController.imprimir);  


// router.put('/',ActaController.EditAgenda);
// router.post('/Eliminar/',ActaController.DelEditAgenda);  

module.exports=router;
