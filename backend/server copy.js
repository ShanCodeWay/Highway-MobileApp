/*import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import validator from 'validator';


const app                                           = express();
const port                                          = 4000;
app.use(cors());
const prefix                                        = 'CMP';
const min                                           = 1000;
const max                                           = 9999;

function generateUniqueId() {
  const randomNum                                   = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${prefix}${randomNum}`;
}



// Body-parser middleware
app.use(bodyParser.urlencoded({ extended            : false }));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Darshana:uom12345@hbms.mn0sf7z.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log(err));

// Define schema for your collection
const Schema                                        = mongoose.Schema;
const complainSchema = new Schema({
  key                                               : { type: String, required: true, unique: true },
  name                                              : String,
  email                                             : String,
  complainType                                      : String,
  complain                                          : String,
  image                                             : String,
  note                                              : String, // Add this line
  createdAt                                         : { type: Date, default: Date.now }
});



// Define model for your collection
const Complaint                                     = mongoose.model('Complaint', complainSchema);


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

const upload                                        = multer({ storage: storage, fileFilter: fileFilter });

// Routes
app.post('/api/data', upload.single('image'), async (req, res) => {
  try {
    const { name, email, complainType, complain }   = req.body;

    const image                                     = req.file ? req.file.filename : '';
    const key                                       = generateUniqueId();

    // Validate the email field using the "validator" package
    if (!validator.isEmail(email)) {
      res.status(400).json({ message                : 'Invalid email address.' });
      return;
    }
    
    const newComplaint = new Complaint({
      key,
      name,
      email,
      complainType,
      complain,
      image,
      createdAt                                     : new Date().toLocaleString(),
    });

    const savedComplaint                            = await newComplaint.save();
    console.log('Complaint saved successfully:', savedComplaint);
    
    // Return saved complaint with generated key
    res.json({ data                                 : savedComplaint, uniqueKey: key });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                  : 'An error occurred while saving the complaint data.' });
  }
});





// Define the endpoint for getting all complaints
app.get('/api/data', async (req, res) => {
  try {
    const complaints                                = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                  : 'An error occurred while getting the complaints.' });
  }
});

// Define the endpoint for getting a single complaint
app.get('/api/data/:id', async (req, res) => {
  try {
    const complaint                                 = await Complaint.findOne({ key: req.params.id });
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message                : 'Complaint not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                  : 'Invalid complaint ID.' });
  }
});


// Define the endpoint for updating a complaint
app.put('/api/data/:id', upload.single('image'), async (req, res) => {
  try {
    const complaint                                 = await Complaint.findOne({ key: req.params.id });
    if (!complaint) {
      res.status(404).json({ message                : 'Complaint not found.' });
      return;
    }
    complaint.name                                  = req.body.name;
    complaint.email                                 = req.body.email;
    complaint.complainType                          = req.body.type;


    complaint.complain                              = req.body.complain;
    if (req.file) {
      complaint.image                               = req.file.filename;
    }
    await complaint.save();
    console.log('Complaint updated successfully:', complaint);
    res.json(complaint);
  
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                  : 'Invalid complaint ID.' });
  }
});
   


// Define the endpoint for deleting a complaint
app.delete('/api/data/:id', async (req, res) => {
  try {
    const result                                    = await Complaint.findOneAndDelete({ key: req.params.id });
    console.log('Result:', result);
    if (!result) {
      res.status(404).json({ message                : 'Complaint not found.' });
      return;
    }
    console.log('Complaint deleted successfully:', result);
    res.json({ message                              : 'Complaint deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                  : 'Invalid complaint ID.' });
  }
});






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/