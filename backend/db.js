const mongoose=require('mongoose');

// const mongoURI="mongodb://127.0.0.1:27017"
<<<<<<< HEAD
const mongoURI="mongodb+srv://ayush:ayush@cluster0.m0u0cnh.mongodb.net/?appName=Cluster0"
=======
const mongoURI="mongodb+srv://ayushagrawal:ayushagrawal@cluster0.5pnzafq.mongodb.net/?retryWrites=true&w=majority"
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
mongoose.set('strictQuery', true)
const  connectToMongo = async()=>{
//    mongoose.connect(mongoURI,()=>{
    
//         console.log("connect to mongo Successfully");
//     })
mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('DB Connected'));
}
module.exports = connectToMongo;
