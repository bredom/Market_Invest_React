const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { AppError, globalErrorHandler } = require('./utils/AppError');

dotenv.config({ path: './config.env' });

var app = express();

//Database Connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the Database.');
  })
  .catch(err => {
    console.log('Unable to connect to the database', err);
  });

app.use(express.json({ extended: false }));

//Logger
app.use(morgan('dev'));

//Test middleware
app.use((req, res, next) => {
  //console.log(req.headers);
  // throw new Error('This is Error');
  // next(new AppError('This is Error', 404));
  next();
});

//Routes
app.get('/', (req, res) => {
  res.send('Hello');
});

//Handling wrong address
app.all('*', (req, res, next) => {
  // res.status(500).send(`Can't find ${req.originalUrl} on this server`);
  return next(
    new AppError(`Can't find ${req.originalUrl} address on the server`, 404)
  );
});

//Serve static assets(React App) in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
