import express from "express"
const router2 = express.Router();
import mongoose from "mongoose";
const Post =mongoose.model("Post");
import requiredLogin from "../middleware/requirelogin.js"

router2.get("/allpost",requiredLogin, (req, res) => {
    Post.find()
    .populate("postedby","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts: posts})
    })
    .catch(error => {
        console.log((error));
    })
})

router2.post("/createpost",requiredLogin,(req, res) => {
    const {title,body,photo}= req.body;
    if(!title || !body || !photo){
       return res.status(422).json({error:"Please add all field"});
    }
    req.user.password= undefined;
    const post = new Post({
        title: title,
        body: body,
        photo:photo,
        postedby: req.user,
    })
    post.save().then(result=>{
        res.json({post: result})
    })
    .catch(error => {
        console.log(error);
    })
})

router2.get("/mypost",requiredLogin,(req, res) => {
    Post.find({postedby: req.user._id})
    .populate("postedby","_id name")
    .then(myPost => {
        res.json({myPost})
    })
    .catch(error => {
        console.log(error);
    })
})

router2.put("/like", requiredLogin, async (req, res) => {
    try {
        const postId = req.body.postId;
        const userId = req.user._id;

        // Check if the user has already liked the post
        const post = await Post.findById(postId);
        if (post.likes.includes(userId)) {
            return res.status(422).json({ error: "User has already liked this post" });
        }

        // If not, update the post with the user's like
        const result = await Post.findByIdAndUpdate(
            postId,
            { $push: { likes: userId } },
            { new: true }
        ).exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});
router2.put("/unlike", requiredLogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router2.put("/comment", requiredLogin, async (req, res) => {
    try {
        const postId = req.body.postId;
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        };

        const result = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate('comments.postedBy', '_id name')
        .populate("postedby", '_id name')

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

router2.delete("/deletepost/:postId", requiredLogin, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.postId}).populate("postedby", '_id').exec();

        if (!post) {
            return res.status(422).json({error: "Post not found"});
        }

        if (post.postedby._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: "You are not authorized to delete this post"});
        }

        await Post.deleteOne({_id: req.params.postId});

        res.json({message: "Post deleted successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});


export default router2