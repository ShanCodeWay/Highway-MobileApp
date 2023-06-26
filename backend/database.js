// database.js

import mongoose from 'mongoose';
import validator from 'validator';

// Connect to MongoDB Atlas
mongoose
  .connect('mongodb+srv://Darshana:uom12345@hbms.mn0sf7z.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log(err));

// Define schema for your collection
const Schema              = mongoose.Schema;
const complainSchema = new Schema({
  key                     : { type: String, required: true, unique: true },
  name                    : String,
  email                   : String,
  complainType            : String,
  complain                : String,
  image                   : String,
  note                    : String, // Add this line
  createdAt               : { type: Date, default: Date.now }
});

const logSchema = new Schema({
  key                     : { type: String, required: true, unique: true },
  name                    : String,
  email                   : String,
  complainType            : String,
  complain                : String,
  image                   : String,
  note                    : String,
  checkbox                : { type: Boolean },
  createdAt               : { type: Date, default: Date.now }
});

// Create the English FAQ schema
const faqSchema = new Schema({
  question: {
    type                  : String,
    required              : true,
  },
  answer: {
    type                  : String,
    required              : true,
  },
});

// Create the Sinhala FAQ schema
const sifaqSchema = new Schema({
  question: {
    type                  : String,
    required              : true,
  },
  answer: {
    type                  : String,
    required              : true,
  },
});

// Create the Tamil FAQ schema
const tafaqSchema = new Schema({
  question: {
    type                  : String,
    required              : true,
  },
  answer: {
    type                  : String,
    required              : true,
  },
});


// Create English EnContacts schema

const encontactsSchema = new Schema({

  name                    : { type: String, required: true },
  phone                   : { type: String, required: true },
  latitude                : { type: Number },
  longitude               : { type: Number },

});

// Create Sinhala EnContacts schema

const sicontactsSchema = new Schema({

  name                    : { type: String, required: true },
  phone                   : { type: String, required: true },
  latitude                : { type: Number },
  longitude               : { type: Number },

});

// Create Tamil EnContacts schema

const tacontactsSchema = new Schema({

  name                    : { type: String, required: true },
  phone                   : { type: String, required: true },
  latitude                : { type: Number },
  longitude               : { type: Number },

});

// Define model for your collection
export const Complaint    = mongoose.model('Complaint', complainSchema);
export const Log          = mongoose.model('Log', logSchema);

export const FAQ          = mongoose.model('FAQ', faqSchema);
export const SiFAQ        = mongoose.model('SiFAQ', sifaqSchema);
export const TaFAQ        = mongoose.model('TaFAQ', tafaqSchema);

export const EnContacts   = mongoose.model('EnContacts', encontactsSchema);
export const SiContacts   = mongoose.model('SiContacts', sicontactsSchema);
export const TaContacts   = mongoose.model('TaContacts', tacontactsSchema);