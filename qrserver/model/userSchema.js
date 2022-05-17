const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  owner:{
    type:String,
    required:true,
  },
  username: {
    type: String,
    required:true,
  },
  password: {
    type: String,
    required:true,
  }
});

// userSchema.pre("save", function(next){

//   if(this.isModified("password")){
//     this.password = bcrypt.hash(this.password,10);
//   }
//   next();
// })

const User = mongoose.model("dealer", userSchema);

module.exports = User;
