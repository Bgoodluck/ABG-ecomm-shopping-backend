const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
  firstName : {
    type: String,
    required: true    
  },
  lastName : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true,
    unique: true   
  },
  password : {
    type: String,
    required: true,
    minlength: 8
  },
  profilePic :{
     type: String     
  },
  role: {
    type: String,    
    default: "user"    
  }  
}, {timestamps : true})

const userModel = mongoose.models.userModel || mongoose.model("user", userSchema);

module.exports =  userModel;




/**POINT NOTES FOR LATER PROJECTS**/
// Assuming default role is 'user' for new users. You can add more roles as per your requirement. 
// Note: This will add a new field to the user schema. You may want to consider using a separate schema for roles if you have a large number of roles. 
// Also, consider adding a role field in the user registration form. 
// You can use middleware to validate the role field before saving the user to the database. 



/**const mongoose = require("mongoose");


const VALID_ROLES = ['user', 'admin'];

const userSchema = new mongoose.Schema ({
  firstName : {
    type: String,
    required: true    
  },
  lastName : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true,
    unique: true   
  },
  password : {
    type: String,
    required: true,
    minlength: 8
  },
  profilePic :{
     type: String     
  },
  role: {
    type: String,
    enum: VALID_ROLES,  
    default: "user",
    validate: {
      validator: function(v) {
        return VALID_ROLES.includes(v);
      },
      message: props => `${props.value} is not a valid role!`
    }
  }  
}, {timestamps : true})

const userModel = mongoose.models.userModel || mongoose.model("user", userSchema);

module.exports = {
  userModel,
  VALID_ROLES
};**/ 