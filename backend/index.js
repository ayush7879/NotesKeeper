const connectToMongo= require("./db");
const express= require('express');
var cors = require('cors')

connectToMongo();
// console.log("here i am ")
const app=express()
const port= 5000
app.use(cors())
app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.use(express.json());
//Available Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port,()=>{
    console.log("App listening at port 3000");
})
