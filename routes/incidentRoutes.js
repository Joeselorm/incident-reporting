
//importing modules
const express = require("express");
const incidentController = require("../controllers/incidentController");
const { reportincident, listincident, filterincident, listincidentbasedoncountry } = incidentController
const incidentCheck = require('../middlewares/incidentCheck')

const router = express.Router()


router.post('/', incidentCheck.incidentReported, reportincident);
router.get('/', filterincident);
// router.get('/', listincident);
router.post('/:country', listincidentbasedoncountry);

module.exports = router;
