import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        profile_image :{
            type : String,
            required : true,
        },
        bio : {
            type : String,
            required : true,
        },
        userId : {
                type :mongoose.Schema.Types.ObjectId,
                ref  : 'User',
                required:true
            }
        
    }, {timestamps : true}
);

export const Profile = mongoose.model("Profile",profileSchema);