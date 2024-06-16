const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001

// middleware
app.use(cors())
app.use(express.json())

// mongodb





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unjawmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




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

    const database = client.db("PotteryDb")
    const craftCollection = database.collection("crafts")

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.post("/crafts", async (req, res) => {
      const crafts = req.body
      //  console.log(crafts)
      const result = await craftCollection.insertOne(crafts)
      res.send(result)

    })
    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find()

      const result = await cursor.toArray()

      res.send(result)


    })
    app.get('/crafts/:id',async(req,res)=>{
      const id =req.params.id
      const query ={_id: new ObjectId(id)}
      const result =await craftCollection.findOne(query)
      res.send(result)
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('pottery house server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})