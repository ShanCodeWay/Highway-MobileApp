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

// Define model for your collection
export const Complaint    = mongoose.model('Complaint', complainSchema);
export const Log          = mongoose.model('Log', logSchema);
