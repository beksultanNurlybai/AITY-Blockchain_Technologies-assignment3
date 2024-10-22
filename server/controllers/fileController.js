const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const {sendMessageToUser} = require('./websocketController');

const filesDirectory = path.join(__dirname, '..', 'uploads');

exports.uploadFile = async (req, res) => {
    const filename = req.body.filename;
    const fileContent = req.body.content;
    const key = req.body.key;

    const filePath = path.join(filesDirectory, filename);
        const user = await User.findOne({ key });
        if (!user) {
            res.json({ message: 'Error validating key' });
            return;
        }
        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                return res.status(500).json({ error: 'File could not be saved' });
            }
            console.log(`File ${filename} uploaded.`);
    
            const message = { event: 'new_file', filename };
            sendMessageToUser(key, message);
    
            res.json({ message: 'File uploaded and user notified' });
        });
};

exports.getFile = (req, res) => {
    const filename = req.params.filename;

    if (path.extname(filename) !== '.py') {
        return res.status(400).json({ error: 'Only .py files are allowed' });
    }

    const filePath = path.join(filesDirectory, filename);
    res.sendFile(filePath);
};

exports.uploadResults = (req, res) => {
    const file_output = req.body.file_output;
    console.log(file_output);
    res.json({ message: 'File execution output uploaded.' });
};
