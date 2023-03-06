

const DelItemController = require('../controllers/DelItemController');

const router = require("express").Router();
router.get('/', DelItemController.DelIMiembroItem);


module.exports = router;