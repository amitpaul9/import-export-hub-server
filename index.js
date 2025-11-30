require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

//middlewear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbs3vpy.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function run (){
    try{
 await client.connect();

const exportDB = client.db('Products');
const ProductsCollection = exportDB.collection('products');
const importCollection = exportDB.collection('imports');
const userCollection = exportDB.collection('users')

// routes start

// get exports data by email
app.get('/exports', async(req, res)=>{
  const query = {};
  const email = req.query.exporter_email;
  if(email){
    query.exporter_email = email;
    console.log('getting email', email)
  }
  const cursor = ProductsCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

//delete my exports
app.delete("/exports/:id", async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await ProductsCollection.deleteOne(query);
  res.send(result)
})


//update my exports
app.patch("/exports/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body;
    
    const query = { _id: new ObjectId(id) };
    const updatedExports = {
      $set: updatedProduct
    };
    const result = await ProductsCollection.updateOne(query, updatedExports);
 
    res.send(result);
    
  } catch(error) {
    console.error('Update error:', error);
    res.status(500).send({ error: error.message });
  }
});


// post exports data 
app.post('/exports', async (req, res)=>{
  try{
    const newUser = req.body;
  console.log('user info', newUser);
  const result = await ProductsCollection.insertOne(newUser);
  res.send(result);
  }
  catch(error){
    console.log(error)
    res.status(500).send({ error: "Failed to insert user" });
  }

})



// products routes 
// get recent product data 
app.get('/products/recent', async(req, res)=>{
  const cursor  = ProductsCollection.find().sort({createdDate: -1}).limit(6);
  const result = await cursor.toArray();
  res.send(result)
})

//get all products data
app.get('/products', async(req, res)=>{
  const cursor  = ProductsCollection.find()
  const result = await cursor.toArray();
  res.send(result)
})

// post product data 
app.post('/products', async(req, res)=>{
  try{
    const newProduct = req.body;
    const result = await ProductsCollection.insertOne(newProduct);
    res.send(result)
  }
  catch(error){
    res.send(500).send({error: "faild to insert product"})
  }
})

// product data by id 

app.get('/products/:id', async(req, res)=>{
  const id = req.params.id;
  const result = await ProductsCollection.findOne({_id: new ObjectId(id)});
  res.send(result)
})


//user routes
// post user 
app.post('/users', async(req, res)=>{
try{
const newUser = req.body;



const email = req.body.email;
const query = {email: email};
const exitstingUser = await userCollection.findOne(query);
if(exitstingUser){
res.send('user already exits')
}
else{
const result =  userCollection.insertOne(newUser);
res.send(result)
}



}
catch(error){
  console.log(error)
}
})

//get user data
app.get('/users', async(req, res)=>{
  const cursor = userCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})



// import routes 
// post import data
app.post('/imports', (req, res)=>{
  try{
  const newImport = req.body;
  const result = importCollection.insertOne(newImport);
  res.send(result);
  }
  catch(error){
    console.log('got and error saving import', error)
  }

})

//get my imports

app.get('/imports', async(req, res)=>{
  const query = {};
  const email = req.query.email
  if(email){
    query.email = email;
    console.log('getting email', email)
  }
  const cursor = importCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})

app.delete("/imports/:id", async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await importCollection.deleteOne(query);
  res.send(result)
})











// routes end 

await client.db('admin').command({ping : 1});
 console.log("Pinged your deployment. You successfully. You successfully connected to MongoDB!")
}
finally{

}
}

run().catch(console.dir)






app.get('/', (req, res)=>{
    res.send("This is my simple crud server");
})

app.listen(port, ()=>{
    console.log(`The port is, ${port}`);
})
