const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

connect().catch((err) => console.log(err));
async function connect() {
  await mongoose
    .connect(url)
    .then(async (result) => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB:", error.message);
    });
}

const Schema = mongoose.Schema;
const phonebookSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  number: { type: String, minLength: 10, required: true },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Phonebook", phonebookSchema);
