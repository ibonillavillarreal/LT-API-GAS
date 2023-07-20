
const routerPersona = require('./PersonaRuta');
const routerAgenda = require('./AgendaRuta');
const routerCargo = require('./CargoRuta');
const routerDelItem = require('./DelItemRoute')
const routerUsuarioRuta = require('./UsuarioRuta');
const routerTracking = require('./TrackingRoute');
const routerActaListado = require('./ActaListado');
const verificarUsuario = require('./UsuarioRuta');

// DEPENDENCIA EXPRESS ´PARA EL ROUTER 
const router = require("express").Router();
router.use('/Persona', routerPersona);
router.use('/Agenda', routerAgenda);
router.use('/Cargo', routerCargo);
router.use('/Usuario', routerUsuarioRuta); 
router.use('/Tracking', routerTracking);
router.use('/Eliminar', routerDelItem);
router.use('/Acta',routerActaListado);
router.use('/verify',verificarUsuario);

module.exports = router;

