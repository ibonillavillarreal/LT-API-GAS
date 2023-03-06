
const routerPersona = require('./PersonaRuta');
const routerAgenda = require('./AgendaRuta');
const routerCargo = require('./CargoRuta');
const routerDelItem = require('./DelItemRoute')
const routerUsuarioRuta = require('./UsuarioRuta');
const routerTracking = require('./TrackingRoute')


// DEPENDENCIA EXPRESS ´PARA EL ROUTER 
const router = require("express").Router();
router.use('/Persona', routerPersona);
router.use('/Agenda', routerAgenda);
router.use('/Cargo', routerCargo);
router.use('/Usuario', routerUsuarioRuta); 
router.use('/Tracking', routerTracking);
router.use('/Eliminar', routerDelItem);


module.exports = router;

