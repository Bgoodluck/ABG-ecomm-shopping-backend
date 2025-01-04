const mongoose = require('mongoose');


const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },    
    profilePic: {
        type: String
    }
},{timestamps : true})

const ProfileModel = mongoose.models.ProfileModel || mongoose.model('Profile', ProfileSchema);


module.exports = ProfileModel;