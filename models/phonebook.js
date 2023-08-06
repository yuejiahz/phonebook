const mongoose = require("mongoose");

require("dotenv").config();

const Schema = mongoose.Schema;
const phonebookSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validator: {
      validate: () => {
        return "/d{2,3}-d+/".test();
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Phonebook", phonebookSchema);
