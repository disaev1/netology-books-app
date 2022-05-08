const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');
const booksViewRoutes = require('./routes/booksView');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/books', booksViewRoutes);
app.use('/public', express.static(path.join(__dirname, './public')));

app.use((req, res) => {
  res.status(404);
  res.send({ status: 'error', message: `Route "${req.url}" is not found` });
});

async function main() {
  await mongoose.connect('mongodb://db:27017/test');

  app.listen(PORT);
}

main().catch(err => console.log(err));
