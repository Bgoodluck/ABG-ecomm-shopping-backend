const userModel = require("../models/userModel")



const uploadProductPermission = async(userId)=>{
    
    try {

        const user = await userModel.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        if (user.role !== "admin") {
            throw new Error("You are not authorized to perform this action");
        }else{
            return true
        }
        
    } catch (error) {
        
        console.error(error);
        throw error;
        
    }
}

module.exports = uploadProductPermission;