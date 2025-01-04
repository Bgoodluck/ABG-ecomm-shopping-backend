const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const validatePassword = (password) => {
    const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return pass.test(password);
  };

  exports.register = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Please provide email",
        });
      }
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: "Invalid password. It must be at least 8 characters long and contain at least one letter and one number.",
        });
      }
      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "Please provide firstName and lastName",
        });
      }
  
      let user = await userModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const profilePicPath = req.file ? req.file.path : null; // File path from multer
  
      const payload = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "user",
        profilePic: profilePicPath, // Save file path to the database
      };
  
      const userData = new userModel(payload);
  
      await userData.save();
  
      const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
      res.status(201).json({
        success: true,
        message: "Registration Successful",
        userData: {
          _id: userData._id,
          token,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          profilePic: userData.profilePic,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  




exports.login = async (req, res)=>{

  try {

    const { email, password } = req.body;

    if (!email ||!password) {
      return res.status(400).json({ 
          success: false, 
          message: "Please provide email and password"
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ 
          success: false, 
          message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ 
          success: false, 
          message: "Invalid password"
      });
    }

    if (isMatch) {
      const payload = {
        id: user._id,
        email: user.email,
        // role: user.role
      }
      const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
      
      const tokenOption = {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true
      }

      res.cookie("token", token, tokenOption ).status(200).json({
        success: true,
        message: "Login Successful",
        userData: {
            _id: user._id,
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email              
        }
      });
      
    }   
    
  } catch (error) {
    console.error(error);
      res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false
      })
  }
}


exports.userDetails = async (req, res) => {
  try {
      console.log("⭐ UserDetails Controller Started");
      console.log("👤 User from request:", req.user._id);
      
      const user = req.user;

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      
      const userResponse = {
          success: true,
          message: "User details retrieved successfully",
          data: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              profilePic: user.profilePic,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              token,
          }
      };

      console.log("✅ Sending user details response");
      return res.status(200).json(userResponse);

  } catch (error) {
      console.log("❌ UserDetails error:", error.message);
      return res.status(500).json({
          success: false,
          message: "Error fetching user details",
          error: error.message
      });
  }
}


exports.logout = async(req, res)=>{
  try {
    res.clearCookie("token");
    return res.json({
        success: true,
        message: "Logged out successfully",
        data: []
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Error logging out",
        error: error.message
    });
  }
}



exports.allUsers = async(req, res)=>{

  try {
    const users = await userModel.find();
    // console.log("allUsers", users)
    return res.json({
        success: true,
        message: "Users retrieved successfully",
        data: users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Error fetching users",
        error: error.message
    });
  }
}


exports.updateUser = async(req, res)=>{

  try {

    const sessionUser = req.userId;

    const { userId, email, firstName, lastName, role } = req.body;

    if (!userId) {
      return res.status(400).json({ 
          success: false, 
          message: "Please provide userId"
      });
    }

    const currentUser = await userModel.findById(sessionUser)

    console.log("user-role", currentUser?.role)

    // if (role && currentUser?.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Only admins can update roles"
    //   });
    // }

    const payload = {
      ...( email && { email : email }),
      ...(firstName && { firstName : firstName }),
     ...(lastName && { lastName : lastName }),
     ...(role && { role : role })
    }

    

    const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

    res.json({
      success: true,
      message: "User updated successfully",
      data: updateUser
    })
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Error fetching users",
        error: error.message
    });
  }

}


// {for admin order inventory}
exports.getUserDetails = async (req, res) => {
  try {
    // console.log("Requested user ID:", req.params.userId);
    const user = await userModel.findById(req.params.userId).select('firstName lastName');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log("User found:", user);
    return res.json({
      success: true,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


