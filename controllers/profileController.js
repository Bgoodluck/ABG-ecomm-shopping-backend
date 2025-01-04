const ProfileModel = require("../models/profileModel");
const userModel = require("../models/userModel");



exports.getProfile = async(req, res)=>{

    try {

        const userId = req.params.id;
        const user = await userModel.findById(userId);
        let profile = await ProfileModel.findOne({ userId : user._id })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        if (!profile) {
            profile = new ProfileModel({ 
                userId: user._id,
                address: user.address,
                phone: user.phone,                
                profilePic: user.profilePic,           
            });
            await profile.save();
        }
        
       return res.json({
            success: true,
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePic: profile?.profilePic || user.profilePic,
                address: profile?.address,
                phone: profile?.phone
            },
            message: "User profile retrieved successfully"
        });
        
    } catch (error) {
        console.error(error);
          res.status(500).json({
              message: error.message || "Internal Server Error",
              success: false
          })
      }
}


exports.updateProfile = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let profile = await ProfileModel.findOne({ userId: user._id });
        
        if (!profile) {
            profile = new ProfileModel({ userId: user._id });
        }

        const { address, phone } = req.body;

        if (address) {
            user.address = address;
            profile.address = address;
        }
        if (phone) {
            user.phone = phone;
            profile.phone = phone;
        }
        
        // Handle file upload
        if (req.file) {
            // Remove old profile picture if exists (optional)
            // You might want to implement file deletion logic here
            
            user.profilePic = req.file.path;
            profile.profilePic = req.file.path;
        }

        await user.save();
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: profile
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}