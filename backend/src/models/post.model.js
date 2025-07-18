import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
{
    post_image: {
        type : [String],
        required: true
    },
    caption: {
        type : String,
        required : true,
    },
    privacy : {
        type : String,
        required : true,
    },
    userId : {
        type :mongoose.Schema.Types.ObjectId,
        ref  : 'User',
        required:true
    }

} ,{ timestamps : true}
);

export const Post = mongoose.model("Post",postSchema);