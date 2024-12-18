const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4jm04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const notpadCollection = client.db('notpad').collection('single-notpad');

    // to save data in local store and mongo database
    app.get('/add-node', async (req, res) => {
        const cursor = notpadCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // to post data in mongo DB and locally
    app.post('/add-node', async (req, res) => {
        const note = req.body;
        const result = await notpadCollection.insertOne(note);
        res.send(result)
    })

    // to get data for delete and get spacific id
    app.get('/add-node/:id', async(req, res) => {
        const id = req.params.id;
        const quary = {_id: new ObjectId(id)};
        const result = await notpadCollection.findOne(quary);
        res.send(result) 
    })

    // to delete item as per the id
    app.delete('/add-node/:id', async(req, res) => {
        const id = req.params.id;
        const quary = {_id: new ObjectId(id)}
        const result = await notpadCollection.deleteOne(quary);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Notepad Server is running!');
})

app.listen(port)
