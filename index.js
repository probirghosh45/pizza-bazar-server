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
    res.send('Pizza Bazar Database working fine!')
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
  const email =req.body.email;
  console.log('new admin added',email)
  console.log(req.body) 
  adminCollection.insertOne({email})
  .then(result => {
    res.send(result.insertedCount > 0);
})

})





// isAdmin Post Request

app.post('/isAdmin', (req, res)=>{
const email = req.body.email;
adminCollection.find({ email: email})
.toArray((err, admin)=>{
 res.send(admin.length> 0);
})
})


});


app.listen(port);