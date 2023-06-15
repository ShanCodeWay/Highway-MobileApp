import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';
import validator from 'validator';
import router from './router.js';




const app                                   = express();
const port                                  = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended    : false }));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect('mongodb+srv://Darshana:uom12345@hbms.mn0sf7z.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser                         : true,
    useUnifiedTopology                      : true,
  })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
