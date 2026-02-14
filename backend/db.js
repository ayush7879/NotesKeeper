const mongoose=require('mongoose');

// const mongoURI="mongodb://127.0.0.1:27017"
const mongoURI="mongodb+srv://ayush:ayush@cluster0.m0u0cnh.mongodb.net/?appName=Cluster0"
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
