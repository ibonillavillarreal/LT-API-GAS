const trackingController = require('../controllers/TrackingController')

const router = require('express').Router();


router.get('/rastreo/:id',trackingController.getRastreaEstacion);  
router.get('/siguiente/:id',trackingController.aplicarSiguienteEstacion);  
router.get('/:num',trackingController.getOrdenEstacion);  


module.exports = router;
