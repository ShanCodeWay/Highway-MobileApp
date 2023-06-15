// router.js

import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import validator from 'validator';
import { Complaint, Log } from './database.js';


const router                                            = express.Router();


const prefix                                            = 'CMP';
const min                                               = 1000;
const max                                               = 9999;

function generateUniqueId() {
  const randomNum                                       = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${prefix}${randomNum}`;
}

// Body-parser middleware
router.use(bodyParser.urlencoded({ extended             : false }));
router.use(bodyParser.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only jpeg and png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload                                            = multer({ storage: storage, fileFilter: fileFilter });

// Define the endpoint for creating a complaint
router.post('/data', upload.single('image'), async (req, res) => {
  try {
    const { name, email, complainType, complain }       = req.body;

    const image                                         = req.file ? req.file.filename : '';
    const key                                           = generateUniqueId();

    // Validate the email field using the "validator" package
    if (!validator.isEmail(email)) {
      res.status(400).json({ message                    : 'Invalid email address.' });
      return;
    }

    const newComplaint = new Complaint({
        key,
        name,
        email,
        complainType,
        complain,
        image,
        createdAt                                       : new Date().toLocaleString(),
        });

        const savedComplaint                            = await newComplaint.save();
console.log('Complaint saved successfully:', savedComplaint);

// Return saved complaint with generated key
res.json({ data                                         : savedComplaint, uniqueKey: key });


} catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'An error occurred while saving the complaint data.' });
    }
    });
    
    // Define the endpoint for getting all complaints or searching by key
    router.get('/data', async (req, res) => {
    try {
    const { key }                                       = req.query;

    if (key) {
        // If a key is provided, search for complaints by key
        const complaints                                = await Complaint.find({ key: key });
        if (complaints.length > 0) {
          res.json(complaints);
        } else {
          res.status(404).json({ message                : 'No complaints found with the provided key.' });
        }
      } else {
        // If no key is provided, return all complaints
        const complaints                                = await Complaint.find();
        res.json(complaints);
      }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message                  : 'An error occurred while getting the complaints.' });
        }
        });
        
        // Define the endpoint for getting a single complaint
        router.get('/data/:key', async (req, res) => {
        try {
        const complaint                                 = await Complaint.findOne({ key: req.params.key });
                                            
        if (complaint) {
            res.json(complaint);
          } else {
            res.status(404).json({ message              : 'Complaint not found.' });
          }

          
        } catch (error) {
            console.error(error);
            res.status(400).json({ message              : 'Invalid complaint key.' });
            }
            });
            
            // Define the endpoint for updating a complaint
            router.put('/data/:key', upload.single('image'), async (req, res) => {
            try {
            const complaint                             = await Complaint.findOne({ key: req.params.key });
            if (!complaint) {
            res.status(404).json({ message              : 'Complaint not found.' });
            return;
            }
            complaint.name                              = req.body.name;
            complaint.email                             = req.body.email;
            complaint.complainType                      = req.body.complainType;
            complaint.complain                          = req.body.complain;
            if (req.file) {
            complaint.image                             = req.file.filename;
            }
            await complaint.save();
            console.log('Complaint updated successfully:', complaint);
            res.json(complaint);
            } catch (error) {
            console.error(error);
            res.status(400).json({ message              : 'Invalid complaint ID.' });
            }
            });
            
            // Define the endpoint for deleting a complaint
            router.delete('/data/:id', async (req, res) => {
            try {
            const complaint                             = await Complaint.findOne({ key: req.params.id });
            if (!complaint) {
            res.status(404).json({ message              : 'Complaint not found.' });
            return;
            }


            // Save the complaint to the log collection
                    const { note, checkbox, ...rest }   = req.body; // Retrieve note and checkbox values from the request body
                    const newLogData = {
                    ...complaint.toJSON(),
                    note,
                    checkbox,
                    ...rest,
                    };
                    const newLog                        = new Log(newLogData);
                    await newLog.save();

                    // Delete the complaint from the complaint collection
                    const result                        = await Complaint.findOneAndDelete({ key: req.params.id });
                    console.log('Result:', result);
                    if (!result) {
                    res.status(404).json({ message      : 'Complaint not found.' });
                    return;
                    }



                    console.log('Complaint deleted successfully:', result);
res.json({ message                                      : 'Complaint deleted successfully.' });


} catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid complaint ID.' });
    }
    });
    
    // Define the endpoint for getting all logs or searching by key
    router.get('/log', async (req, res) => {
    try {
    const { key }                                       = req.query;

    if (key) {
        // If a key is provided, search for logs by key
        const logs                                      = await Log.find({ key: key });
        if (logs.length > 0) {
          res.json(logs);
        } else {
          res.status(404).json({ message                : 'No logs found with the provided key.' });
        }
      } else {
        // If no key is provided, return all logs
        const logs                                      = await Log.find();
        res.json(logs);
      }
      

    } catch (error) {
        console.error(error);
        res.status(500).json({ message                  : 'An error occurred while getting the logs.' });
        }
        });
        
        // Define the endpoint for getting a single log
        router.get('/log/:key', async (req, res) => {
        try {
        const log                                       = await Log.findOne({ key: req.params.key });


        if (log) {
            res.json(log);
          } else {
            res.status(404).json({ message              : 'Log not found.' });
          }

        } catch (error) {
            console.error(error);
            res.status(400).json({ message              : 'Invalid log key.' });
            }
            });
            
            // Define the endpoint for deleting a log
            router.delete('/log/:id', async (req, res) => {
            try {
            const result                                = await Log.findOneAndDelete({ key: req.params.id });
            console.log('Result:', result);
            if (!result) {
            res.status(404).json({ message              : 'Log not found.' });
            return;
            }
            console.log('Log deleted successfully:', result);
            res.json({ message                          : 'Log deleted successfully.' });
            } catch (error) {
            console.error(error);
            res.status(400).json({ message              : 'Invalid log ID.' });
            }
            });
            
           

           
          export default router;




