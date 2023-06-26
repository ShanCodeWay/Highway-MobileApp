// router.js

import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
import validator from 'validator';
import { Complaint, Log, FAQ, EnContacts,SiContacts, TaContacts, SiFAQ, TaFAQ }  from './database.js';


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
            
                  ///////////// FAQ router
              /////////////


              //English FAQ
// Define the endpoint for getting all FAQ entries
router.get('/faq', async (req, res) => {
  try {
    const faqs                                          = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'An error occurred while getting the FAQ entries.' });
  }
});

// Define the endpoint for getting a single FAQ entry
router.get('/faq/:id', async (req, res) => {
  try {
    const faq                                           = await FAQ.findById(req.params.id);
    if (faq) {
      res.json(faq);
    } else {
      res.status(404).json({ message                    : 'FAQ entry not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid FAQ entry ID.' });
  }
});

// Define the endpoint for creating an FAQ entry
router.post('/faq', async (req, res) => {
  try {
    const { question, answer }                          = req.body;

    // Create a new FAQ entry
    const newFAQ                                        = new FAQ({ question, answer });

    // Save the FAQ entry to the database
    await newFAQ.save();

    res.status(201).json({ message                      : 'FAQ entry created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to create FAQ entry' });
  }
});

// Define the endpoint for updating an FAQ entry
router.put('/faq/:id', async (req, res) => {
  try {
    const { question, answer }                          = req.body;

    // Find the FAQ entry in the database
    const faq                                           = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message             : 'FAQ entry not found' });
    }

    // Update the FAQ entry
    faq.question                                        = question;
    faq.answer                                          = answer;

    // Save the updated FAQ entry
    await faq.save();

    res.json({ message                                  : 'FAQ entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to update FAQ entry' });
  }
});

// Define the endpoint for deleting an FAQ entry
router.delete('/faq/:id', async (req, res) => {
  try {
    const result                                        = await FAQ.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message                    : 'FAQ entry not found' });
      return;
    }
    res.json({ message                                  : 'FAQ entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to delete FAQ entry' });
  }
});

/// Sinhala FAQ

// Define the endpoint for getting all FAQ entries
router.get('/sifaq', async (req, res) => {
  try {
    const sifaqs                                        = await SiFAQ.find();
    res.json(sifaqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'An error occurred while getting the FAQ entries.' });
  }
});

// Define the endpoint for getting a single FAQ entry
router.get('/sifaq/:id', async (req, res) => {
  try {
    const sifaq                                         = await SiFAQ.findById(req.params.id);
    if (sifaq) {
      res.json(sifaq);
    } else {
      res.status(404).json({ message                    : 'FAQ entry not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid FAQ entry ID.' });
  }
});

// Define the endpoint for creating an FAQ entry
router.post('/sifaq', async (req, res) => {
  try {
    const { question, answer }                          = req.body;

    // Create a new FAQ entry
    const newSiFAQ                                      = new SiFAQ({ question, answer });

    // Save the FAQ entry to the database
    await newSiFAQ.save();

    res.status(201).json({ message                      : 'FAQ entry created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to create FAQ entry' });
  }
});

// Define the endpoint for updating an FAQ entry
router.put('/sifaq/:id', async (req, res) => {
  try {
    const { question, answer }                          = req.body;

    // Find the FAQ entry in the database
    const sifaq                                         = await SiFAQ.findById(req.params.id);

    if (!sifaq) {
      return res.status(404).json({ message             : 'FAQ entry not found' });
    }

    // Update the FAQ entry
    sifaq.question                                      = question;
    sifaq.answer                                        = answer;

    // Save the updated FAQ entry
    await sifaq.save();

    res.json({ message                                  : 'FAQ entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to update FAQ entry' });
  }
});

// Define the endpoint for deleting an FAQ entry
router.delete('/sifaq/:id', async (req, res) => {
  try {
    const result                                        = await SiFAQ.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message                    : 'FAQ entry not found' });
      return;
    }
    res.json({ message                                  : 'FAQ entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to delete FAQ entry' });
  }
});


////Tamil FAQ
/// 
/// 
// Define the endpoint for getting all FAQ entries
router.get('/tafaq', async (req, res) => {
  try {
    const tafaqs                                        = await TaFAQ.find();
    res.json(tafaqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'An error occurred while getting the FAQ entries.' });
  }
});

// Define the endpoint for getting a single FAQ entry
router.get('/tafaq/:id', async (req, res) => {
  try {
    const tafaq                                         = await TaFAQ.findById(req.params.id);
    if (tafaq) {
      res.json(tafaq);
    } else {
      res.status(404).json({ message                    : 'FAQ entry not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid FAQ entry ID.' });
  }
});

// Define the endpoint for creating an FAQ entry
router.post('/tafaq', async (req, res) => {
  try {
    const { question, answer }                          = req.body;

    // Create a new FAQ entry
    const newTaFAQ                                      = new TaFAQ({ question, answer });

    // Save the FAQ entry to the database
    await newTaFAQ.save();

    res.status(201).json({ message                      : 'FAQ entry created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to create FAQ entry' });
  }
});

// Define the endpoint for updating an FAQ entry
router.put('/tafaq/:id', async (req, res) => {
  try {
    const { question, answer }                          = req.body;

    // Find the FAQ entry in the database
    const tafaq                                         = await TaFAQ.findById(req.params.id);

    if (!tafaq) {
      return res.status(404).json({ message             : 'FAQ entry not found' });
    }

    // Update the FAQ entry
    tafaq.question                                      = question;
    tafaq.answer                                        = answer;

    // Save the updated FAQ entry
    await tafaq.save();

    res.json({ message                                  : 'FAQ entry updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to update FAQ entry' });
  }
});

// Define the endpoint for deleting an FAQ entry
router.delete('/tafaq/:id', async (req, res) => {
  try {
    const result                                        = await TaFAQ.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message                    : 'FAQ entry not found' });
      return;
    }
    res.json({ message                                  : 'FAQ entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to delete FAQ entry' });
  }
});




/////Contacts





// EnContacts router

router.post('/encontacts', async (req, res) => {
  try {
    const { name, phone, latitude, longitude }          = req.body;

    // Check if the required fields are present
    if (!name || !phone) {
      return res.status(400).json({ message             : 'Name and phone are required fields' });
    }

    // Create a new contact
    const newContact                                    = new EnContacts({ name, phone, latitude, longitude });

    // Save the contact to the database
    await newContact.save();

    res.status(201).json({ message                      : 'Contact created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to create contact' });
  }
});



// Update a contact
router.put('/encontacts/:id', async (req, res) => {
  try {
    const {  name, phone, latitude, longitude }         = req.body;

    // Find the contact in the database
    const contact                                       = await EnContacts.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message             : 'Contact not found' });
    }

    // Update the contact
    contact.name                                        = name;
    contact.phone                                       = phone;
    contact.latitude                                    = latitude;
    contact.longitude                                   = longitude;

    // Save the updated contact
    await contact.save();

    res.json({ message                                  : 'Contact updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to update contact' });
  }
});


// Delete a contact
router.delete('/encontacts/:id', async (req, res) => {
  try {
    const result                                        = await EnContacts.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message                    : 'Contact not found' });
      return;
    }
    res.json({ message                                  : 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to delete contact' });
  }
});


// Get all contacts
router.get('/encontacts', async (req, res) => {
  try {
    const contacts                                      = await EnContacts.find();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to fetch contacts' });
  }
});


// Get a single contact
router.get('/encontacts/:id', async (req, res) => {
  try {
    const contact                                       = await EnContacts.findById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message                    : 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid contact ID' });
  }
});


////sinhala contact


router.post('/sicontacts', async (req, res) => {
  try {
    const { name, phone, latitude, longitude }          = req.body;

    // Check if the required fields are present
    if (!name || !phone) {
      return res.status(400).json({ message             : 'Name and phone are required fields' });
    }

    // Create a new contact
    const newContact                                    = new SiContacts({ name, phone, latitude, longitude });

    // Save the contact to the database
    await newContact.save();

    res.status(201).json({ message                      : 'Contact created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to create contact' });
  }
});



// Update a contact
router.put('/sicontacts/:id', async (req, res) => {
  try {
    const {  name, phone, latitude, longitude }         = req.body;

    // Find the contact in the database
    const contact                                       = await SiContacts.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message             : 'Contact not found' });
    }

    // Update the contact
    contact.name                                        = name;
    contact.phone                                       = phone;
    contact.latitude                                    = latitude;
    contact.longitude                                   = longitude;

    // Save the updated contact
    await contact.save();

    res.json({ message                                  : 'Contact updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to update contact' });
  }
});


// Delete a contact
router.delete('/sicontacts/:id', async (req, res) => {
  try {
    const result                                        = await SiContacts.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message                    : 'Contact not found' });
      return;
    }
    res.json({ message                                  : 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to delete contact' });
  }
});


// Get all contacts
router.get('/sicontacts', async (req, res) => {
  try {
    const contacts                                      = await SiContacts.find();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to fetch contacts' });
  }
});


// Get a single contact
router.get('/sicontacts/:id', async (req, res) => {
  try {
    const contact                                       = await SiContacts.findById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message                    : 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid contact ID' });
  }
});



////tamil contact



router.post('/tacontacts', async (req, res) => {
  try {
    const { name, phone, latitude, longitude }          = req.body;

    // Check if the required fields are present
    if (!name || !phone) {
      return res.status(400).json({ message             : 'Name and phone are required fields' });
    }

    // Create a new contact
    const newContact                                    = new TaContacts({ name, phone, latitude, longitude });

    // Save the contact to the database
    await newContact.save();

    res.status(201).json({ message                      : 'Contact created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to create contact' });
  }
});



// Update a contact
router.put('/tacontacts/:id', async (req, res) => {
  try {
    const {  name, phone, latitude, longitude }         = req.body;

    // Find the contact in the database
    const contact                                       = await TaContacts.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message             : 'Contact not found' });
    }

    // Update the contact
    contact.name                                        = name;
    contact.phone                                       = phone;
    contact.latitude                                    = latitude;
    contact.longitude                                   = longitude;

    // Save the updated contact
    await contact.save();

    res.json({ message                                  : 'Contact updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to update contact' });
  }
});


// Delete a contact
router.delete('/tacontacts/:id', async (req, res) => {
  try {
    const result                                        = await TaContacts.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message                    : 'Contact not found' });
      return;
    }
    res.json({ message                                  : 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to delete contact' });
  }
});


// Get all contacts
router.get('/tacontacts', async (req, res) => {
  try {
    const contacts                                      = await TaContacts.find();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message                      : 'Failed to fetch contacts' });
  }
});


// Get a single contact
router.get('/tacontacts/:id', async (req, res) => {
  try {
    const contact                                       = await TaContacts.findById(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message                    : 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message                      : 'Invalid contact ID' });
  }
});


           
          export default router;




