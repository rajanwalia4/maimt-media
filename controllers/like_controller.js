const like = require("../models/comments");
const Posts = require("../models/posts");
const Likes = require("../models/likes");

// like/unlike API
module.exports.like = async(req,res)=>{

    try{
    // get userId = req.user.id;
    const userId = req.user.id;
    // get post id;
    const postId = req.body.postId;
    // check whether the post exist or not
    // find previous likes
    if(!userId || !postId)
        return res.json("Missing userId or PostId");
    const post = await Posts.findByPk(postId);
    if(!post)
    return res.status(404).json({"error":"Post Not Found"});
    const like = await Likes.findOne({
        where:{
            PostId:postId,
            UserId:userId
        }
    })

    // Unlike the post
    if(like){
        
        await Posts.update({
            likeCount:post.likeCount-1
        },{
            where:{
                id:postId
            }
        });

        await Likes.destroy({
            where:{
                id:like.id
            }
        })
        let likeCount = post.likeCount-1;
        return res.status(202).json({"success":"Post Unliked","likeCount":likeCount});
    }

    // increase the likeCount by 1
    await Posts.update({
        likeCount:post.likeCount+1
    },{
        where:{
            id:postId
        }
    });

    // put the entry of userId = req.user.id;  and postId in the like table
    await Likes.create({
        UserId:userId,
        PostId:postId
    });
    let likeCount = post.likeCount+1;
    return res.status(201).json({"success":"Post Liked","likeCount":likeCount});

    }catch(err){
        return res.redirect("/");
    }
}

module.exports.isUserLiked = async (req,res)=>{
    const PostId = req.params.postId;
    const UserId = req.user.id;
    try{
        const likedUsers = await Likes.findOne({
            where:{
                PostId,
                UserId
            }
        });
        if(likedUsers)
            return res.status(200).json({"isLiked":"true"});
     
        return res.status(200).json({"isLiked":"false"});
    }catch(err){
        return res.status(404).json(err);
    }
    
}
