import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        // required:true,
    },
    postedby:{
        type:ObjectId,
        ref:"User",
    },
    likes:[{
        type:ObjectId,
        ref:"User",
    }],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:"User",
        }
    }]
})

const Post = mongoose.model("Post",postSchema)
export default Post;