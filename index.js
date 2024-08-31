const express = require('express')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, CURSOR_FLAGS } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// middleWare 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpqoiya.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const brandCollection = client.db('foodixDb').collection('brand')
        const categoryCollection = client.db('foodixDb').collection('category')
        // const addProductCollection = client.db('foodixDb').collection('addProduct')
        const cartsCollection = client.db('foodixDb').collection('carts')



        // brand collection api
        app.get('/read-brand', async (req, res) => {
            const result = await brandCollection.find().toArray()
            res.send(result)
        })

        // category collection api

        app.get('/read-category', async (req, res) => {
            const result = await categoryCollection.find().toArray()
            res.send(result)
        })

        app.get('/read-category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.findOne(query)
            res.send(result)
        })


        // added the product related api
        app.post('/addProduct', async (req, res) => {
            const foodProduct = req.body;
            const result = await categoryCollection.insertOne(foodProduct)
            res.send(result)
        })

        // cart related api
        app.get('/read-carts', async (req, res) => {
            const email = req.query.email;
            let query = {}
            if (email) {
                query = { email: email }
            }

            const result = await cartsCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/added-carts', async (req, res) => {
            const product = req.body;
            const result = await cartsCollection.insertOne(product)
            res.send(result)

        })

        app.delete('/cart-delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query)
            res.send(result)
        })


        // all product api
        app.get('/allProduct', async (req, res) => {
            const result = await categoryCollection.find().toArray()
            res.send(result)
        })

        app.get('/read-singleProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.findOne(query)
            res.send(result)
        })

        app.put('/product-update/:id', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    ...product
                }
            }
            const result = await categoryCollection.updateOne(filter, updateDoc)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('foodix site is running')
})

app.listen(port, () => {
    console.log(`app listening on PORT : ${port}`);
})