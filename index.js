const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/' , (req,res) => {
    res.send('Boss Is Setting.');
});

// Start MongoDB

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6khd2rb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const menuCollection = client.db('bistroDB').collection('menu');
    const reviewsCollection = client.db('bistroDB').collection('reviews');
    const cartCollection = client.db('bistroDB').collection('carts');

    // Menu Collection:-
    app.get('/menu' , async(req,res) => {
        const result = await menuCollection.find().toArray();
        res.send(result);
    });


    // Reviews Collection:-
    app.get('/review' , async(req,res) => {
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    });

    // Cart Collection:-

    app.get('/carts' , async(req,res) => {
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email : email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts' , async(req,res) => {
      const item = req.body;
      console.log(item)
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port , () => {
    console.log(`Bistro Boss Server is Running on port ${port}`);
});