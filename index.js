const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      
      "https://assignment10-c6fa5.web.app",
    ],
  })
);
app.use(express.json());
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
    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query)
      res.send(result)
    })
    app.get('/myCrafts/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const myCrafts = craftCollection.find(query)
      const result = await myCrafts.toArray()
      res.send(result)
    })
    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id
      const craft = req.body
      // console.log(craft)
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCraft = {
        $set: {
          image: craft.image,
          item_name: craft.item_name,
          short_description: craft.short_description,
          subcategory_Name: craft.subcategory_Name,
          price: craft.price,
          rating: craft.rating,
          customization: craft.customization,
          processing_time: craft.processing_time,
          stock_status: craft.stock_status,
          made_by: craft.made_by
        }
      }
      const result = await craftCollection.updateOne(filter, updatedCraft, options)
      res.send(result)

    })

    app.delete('/crafts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.deleteOne(query)
      res.send(result)


    })

    app.get('/allCrafts', async (req, res) => {
      const allCrafts = craftCollection.find();
      const results = await allCrafts.toArray()
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
      const startIndex = (page - 1) * limit
      const lastIndex = (page) * limit

      const craftResult = {}
      craftResult.totalCrafts = results.length
      craftResult.pageCount = Math.ceil(results.length / limit)

      if (lastIndex < results.length) {
        craftResult.next = {
          page: page + 1
        }
      }

      if (startIndex > 0) {
        craftResult.prev = {
          page: page - 1
        }
      }



      craftResult.result = results.slice(startIndex, lastIndex)
      res.json(craftResult)
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