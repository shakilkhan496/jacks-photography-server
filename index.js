const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.83izqje.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

async function run() {
    try {
        console.log('database connection');


    }
    finally {
        // perform
    }

}
run().catch(console.dir)











app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
//middleware
app.use(cors());
app.use(express.json());
