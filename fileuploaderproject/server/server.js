const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const exp = require('constants');

const app = express();
const port = 3001;


const upload = multer({ dest: 'uploads/' });

const storage = new Storage({ keyFilename: 'here i have to make my service account key' });
const bucketName = 'my-docket-uploads'; 
const bucket = storage.bucket(bucketName);

app.use(express.static('public'))

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path; 
    const gcsFileName = "my-first-gcp"; 

    
    await bucket.upload(filePath, {
      destination: gcsFileName, 
      metadata: {
        contentType: req.file.mimetype, 
      },
    });

    res.status(200).send(`File uploaded to GCP bucket: ${gcsFileName}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Failed to upload file to GCP bucket.');
  }
});
// Start the serverff
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
