const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/upload', fileController.uploadFile);
router.get('/files/:filename', fileController.getFile);
router.post('/results', fileController.uploadResults);

module.exports = router;
