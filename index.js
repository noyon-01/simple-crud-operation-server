const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();

    let db = client.db("simple_crud_operation");
    let usersCollection = db.collection("users");

    // Routes
    app.get("/", async (req, res) => {
      res.send("simple crud operation server is running!");
    });

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = {
        _id: new ObjectId(id),
      };
      // console.log(query);
      const result = await usersCollection.findOne(query);
      // console.log(result)
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("server data:", newUser)
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await usersCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

app.listen(port, () => {
  console.log(`simple crud operation server is running on port ${port}`);
});
