

const UsuarioController = require('../controllers/UsuarioController');
const verificar = require('../middleware/Authorization');

const  router = require('express').Router();
    router.get('/',UsuarioController.usuariosGet);
    router.post('/get',UsuarioController.usuarioGet);
    router.put('/:id',UsuarioController.usuariosPut);
    router.post('/',UsuarioController.usuariosPost);
    router.delete('/',UsuarioController.usuariosDelete);
    router.patch('/',UsuarioController.usuariosPatch); 
    
    //llamada de fx verifica token
    router.post('/verify/',verificar.verifyToken);


module.exports = router;


