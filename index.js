const express = require('express')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

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
        await client.connect();


        const foodsCollection = client.db('foodsDB').collection('food')
        const cartCollection = client.db('foodsDB').collection('carts')
        const productCollection = client.db('foodsDB').collection('products')
        const foodCategoryCollection = client.db('foodsDB').collection('foodCategory')


        // product 
        app.get('/brand/products', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })


        // user addItem 
        app.get('/addedProduct', async (req, res) => {
            const cursor = await foodsCollection.find().toArray()
            res.send(cursor)
        })

        app.get('/addedProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.findOne(query)
            res.send(result)
        })

        app.post('/addedProduct', async (req, res) => {
            const newFood = req.body;
            console.log(newFood);
            const result = await foodsCollection.insertOne(newFood)
            res.send(result)
        })

        // add to cart 
        app.post('/carts', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await cartCollection.insertOne(newCart)
            res.send(result)
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server site is running')
})

app.listen(port, () => {
    console.log(`app listening on PORT : ${port}`);
})