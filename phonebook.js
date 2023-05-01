
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI;
console.log(url, process.env.MONGODB_URI)
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phonebookSchema = mongoose.Schema({
    name: String,
    number: String,
  })

  phonebookSchema.set("toJSON", {
    transform:(document, returnedObj)=>{
        returnedObjid=returnedObj._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model("Phonebook",phonebookSchema)