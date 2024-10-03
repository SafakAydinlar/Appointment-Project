const express = require('express');
const cors = require('cors');
const app = express();
const createTable = require('./createTable');

createTable();

app.use(cors());
app.use(express.json());


app.use('/api', require('./routes/auth'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});