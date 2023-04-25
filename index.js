const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.7ldqh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const serviceCollection = client.db("cleanCo").collection("services");

    //get all service data
    app.get("/get-services", async (req, res) => {
      const services = await serviceCollection.find({}).toArray();
      res.send(services);
    });

    //create a new service
    app.post("/add-service", async (req, res) => {
      const data = req.body;
      const result = await serviceCollection.insertOne(data);
      res.send(result);
    });

    //update a service data
    app.put("/update-service/:id", async (req, res) => {
      const id = req.params;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $set: data };
      const option = { upsert: true };
      const result = await serviceCollection.updateOne(
        filter,
        updatedDoc,
        option
      );
      res.send(result);
    });

    app.delete("/delete-service/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
