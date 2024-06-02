
const mongoose = require("mongoose"); 
  
// Creating Message Model 
const messageSchema = new mongoose.Schema({ 

    //models must be string, string(required), date
    msgNr: { type: Number, required: true},
    name: { type: String },
    text: { type: String, required: true }, 
    time: { type: String },

}); 
  
const Message = mongoose.model("Message", messageSchema); 
  
module.exports = Message; 
