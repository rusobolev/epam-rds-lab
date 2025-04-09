require('dotenv').config();
const express = require('express');
const imageRoutes = require('./routes/images');

const app = express();
app.use(express.json());
app.use('/images', imageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});