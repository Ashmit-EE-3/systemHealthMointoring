const express = require('express');
const { createSystem, getSystem, getAllSystems, exportData } = require('../controller/system.controller');

const router = express.Router(); 

router.route('/newSystem').post(createSystem);
router.route('/getSystem').get(getSystem) ; 
//getSystem?platform=Windows&version=v23.10.1&updateStatus=false&diskEncryption=true&antivirus=true&isCompliant=true
router.route('/exportData').get(exportData) ; 

module.exports = router; 
