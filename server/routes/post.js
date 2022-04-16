const { request } = require('express')
const express=require('express')
const router=express.Router()
const mongoose= require('mongoose')
const requiredLogin =require('../middleware/requiredLogin')
const Post =mongoose.model("Post")
router.get('/allpost',requiredLogin,(req,res)=>{
    Post.find()
    //populating postedby
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/getsubscribedpost',requiredLogin,(req,res)=>{
    //if postedby is available in the  following 
    Post.find({postedBy:{$in:req.user.following}})
    //populating postedby
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body,pic,phone,address}=req.body
    if(!title || !body || !pic || !phone || !address){
        return res.status(422).json({error:"Please add all the fields"})
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password=undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        phone,
        address,
        postedBy:req.user


    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requiredLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        //only logged in user will like the post
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        //only logged in user will unlike the post
        //here we use pull to do unlike
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


router.put('/comment',requiredLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        //only logged in user will like the post
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")

    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
                return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
                .then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err)
                })
        }
    })
})

router.delete("/deletecomment/:id/:comment_id", requiredLogin, (req, res) => {
    const comment = { _id: req.params.comment_id };
    Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { comments: comment },
      },
      {
        new: true, 
      }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name ")
      .exec((err, postComment) => {
        if (err || !postComment) {
          return res.status(422).json({ error: err });
        } else {
         
          const result = postComment;
          res.json(result);
        }
      });
  });
module.exports = router