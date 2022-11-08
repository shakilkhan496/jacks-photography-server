const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
    res.send(`Server is running on port ${port}`);
})

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.83izqje.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function JWTVerification(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            })
        }
        req.decoded = decoded;
        next();
    })
}



async function run() {



    //JWT
    app.post('/jwt', async (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
        res.send({ token });
    })





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

        app.get('/customerReviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);

        })

        //updateCustomer reviews
        app.patch('/customerReviews/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body.reviewDetails;
            console.log(body)
            const query = { _id: ObjectId(id) };
            const updatedReview = {
                $set: {
                    reviewDetails: body
                }
            }
            const result = await reviewsCollection.updateOne(query, updatedReview);
            res.send(result);

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
            const cursor = reviewsCollection.find(query).sort({ date: -1, });
            const reviews = await cursor.toArray();
            res.send(reviews);
            console.log(query);
        })

        //get reviews by userEmail
        app.get('/myReviews', JWTVerification, async (req, res) => {

            const decoded = req.decoded;

            if (decoded.email !== req.query.email) {
                return res.status(403).json({
                    status: 403,
                })
            }


            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
            console.log(query);
        })

        app.delete('/customerReviews', async (req, res) => {
            const id = req.body;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        //post services
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await servicesCollection.insertOne(service);
            res.send(result);
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
