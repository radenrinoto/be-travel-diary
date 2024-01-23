const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const router = require('./routes');

const app = express();

const PORT = 3001;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)

app.get('/', (req, res) => {
  res.send('Connected')
})

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});
