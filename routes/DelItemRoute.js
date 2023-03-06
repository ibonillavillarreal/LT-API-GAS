

const DelItemController = require('../controllers/DelItemController');

const router = require("express").Router();
router.post('/', DelItemController.DelIMiembroItem);


module.exports = router;