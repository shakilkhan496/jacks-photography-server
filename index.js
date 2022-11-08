const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
})

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.83izqje.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        console.log('database connection');
        const servicesCollection = client.db("jacksPhotography").collection("services");
        const reviewsCollection = client.db("jacksPhotography").collection("reviews");

        //get limit services
        app.get('/servicesLimit', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })


        //all services
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);


        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        })


        //post reviews
        app.post('/customerReviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })
        //get reviews by productID
        app.get('/customerReviews', async (req, res) => {
            let query = {};
            if (req.query.productID) {
                query = {
                    productID: req.query.productID
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
            console.log(query);
        })



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
