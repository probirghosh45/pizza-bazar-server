const express = require('express');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors=require('cors');
const ObjectId =require('mongodb').ObjectId;  //for delete & patch [update] operation



// creating APP by calling express
const app=express();

// middleware for CRUD Operation
app.use(express.json());
app.use(cors());


// dynamic port (for heroku) configuration for app.listen (port)
const port = process.env.PORT || 7500


app.get('/',(req,res)=>{
    res.send('Wedding Photography Database working fine!')
})



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.cnvk9.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(process.env.DB_USER_NAME)
// console.log(process.env.DB_USER_PASSWORD)
// console.log(process.env.DATABASE_NAME)




// product Management

client.connect(err => {
  const productCollection = client.db(`${process.env.DATABASE_NAME}`).collection("products");
  const adminCollection = client.db(`${process.env.DATABASE_NAME}`).collection("admin");
  const orderCollection = client.db(`${process.env.DATABASE_NAME}`).collection("orders");
  const reviewCollection = client.db(`${process.env.DATABASE_NAME}`).collection("reviews");


//    console.log('Database Connected')
//    console.log('connection err', err)


//  add Product Post Request
app.post('/addProduct',(req,res)=>{
    const product=req.body;
    console.log('new book added', product)
    productCollection.insertOne(product)
    .then(result=>{
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
})

//  Product Get Request
app.get('/products',(req,res)=>{
  productCollection.find({})
  .toArray((err,docs)=>res.send(docs))
})

// Product Delete Request
app.delete('/delete/:id',(req,res)=>{
  productCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result =>{
    res.send(result.deletedCount > 0)
  })
})

// Product Update Request
app.patch('/update/:id',(req,res)=>{
 
  productCollection.updateOne({_id:ObjectId(req.params.id)},
  
  {
    $set: req.body
  })

  .then(result=>{
    res.send(result.modifiedCount > 0)
  })
})


// Add Admin Post Request

        
app.post('/addAdmin', (req, res)=>{
  const email =req.body;
  console.log('new admin added',email)
  adminCollection.insertOne(email)
  .then(result => {
    res.send(result.insertedCount > 0);
})

})





// isAdmin Get Request

app.post('/isAdmin', (req, res)=>{
const email = req.body.email;
adminCollection.find({ email: email})
.toArray((err, admin)=>{
 res.send(admin.length> 0);
})
})


// Review Post Request

app.post('/addReview', (req, res)=>{
  const review =req.body;
  console.log('new review added',review);
  reviewCollection.insertOne(review)
  .then(result => {
    res.send(result.insertedCount > 0);
})

})

// Review Get Request

app.get('/reviews',(req,res)=>{
  reviewCollection.find({})
  .toArray((err,docs)=>res.send(docs))
})


// Order Post Request

app.post('/addOrder', (req, res)=>{
  const order =req.body;
  console.log('new order added',order)
  orderCollection.insertOne(order)
  .then(result => {
    res.send(result.insertedCount > 0);
})

})

// Order Get Request

app.get('/orders',(req,res)=>{
  const queryEmail=req.query.email;  // according to client email order list will be different
  orderCollection.find({email: queryEmail})
  .toArray((err,docs)=>res.send(docs))
})


//  All Order Get Request
app.get('/allOrders',(req,res)=>{
  orderCollection.find({})
  .toArray((err,docs)=>res.send(docs))
})


});

app.listen(port);