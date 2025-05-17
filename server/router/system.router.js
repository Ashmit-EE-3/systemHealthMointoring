const express = require('express');
const { createSystem } = require('../controller/system.controller');

const router = express.Router(); 

router.route('/newSystem').post(createSystem);

module.exports = router; 