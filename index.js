const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
//middleware
app.use(cors());
app.use(express.json());
