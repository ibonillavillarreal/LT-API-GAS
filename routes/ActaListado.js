
const multer = require('multer');
const multipart = require('connect-multiparty');
const multiPartMiddleware = multipart({ uploadDir: '../zSubidas' });

const ActaController = require('../controllers/ActaController');
const router = require('express').Router();



router.get('/', ActaController.getActaListado);
router.get('/ActaDetalle/:id', ActaController.getActaDetalle);
router.get('/getNroActa', ActaController.getNroActa);
router.get('/getNroIdAcuerdo', ActaController.getNroIdAcuerdo);
router.get('/getAgendaActa', ActaController.getAgendaActa);
router.post('/postgetPuntosDeAgenda', ActaController.postgetPuntosDeAgenda);
router.post('/AddJsonActa', ActaController.Add_Json_Acta);
router.get('/imprimir/print/:id', ActaController.imprimir);


/***********************************************************************/
const storage = multer.diskStorage({
    filename: function (res, file, cb) {
        const ext = file.originalname.split(".").pop();
        const filename = Date.now();
        //cb(null, `${filename}.${ext}`)
        cb(null, file.originalname)
    },
    destination: function (res, file, cb) {

        cb(null, `../zSubidas`)
    }
});
const upload = multer({storage});
router.post('/Subir',upload.single('docfile'),ActaController.subir);    
/***********************************************************************/

// filename : cod_acta
router.post('/Bajar/Docx/',upload.single('docfile'),ActaController.download);    
/***********************************************************************/


// router.put('/',ActaController.EditAgenda);
// router.post('/Eliminar/',ActaController.DelEditAgenda);  
module.exports = router;
