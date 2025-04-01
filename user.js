require('dotenv').config();
const express = require('express');
const app = express();
require('./config/mongoose');
const cookieParser = require("cookie-parser");
const userRoutes = require("./config/userRoutes");


app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(userRoutes);




app.listen(5000, () => {
    console.log('Server is op port 5000');
  });
  