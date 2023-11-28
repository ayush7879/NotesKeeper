const mongoose=require('mongoose');

// const mongoURI="mongodb://127.0.0.1:27017"
const mongoURI="mongodb+srv://ayushagrawal:ayushagrawal@cluster0.5pnzafq.mongodb.net/?retryWrites=true&w=majority"
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
