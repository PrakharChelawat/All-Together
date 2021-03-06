import React, { useState, useEffect ,useContext} from "react";
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
  const [data, setData] = useState([]);
  const {state,dispatch} = useContext(UserContext)
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        //if user is logged in than only user can see the post
        "Authorization": "hello " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);
  const likePost = (id)=>{
        fetch('/like',{
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"hello "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            postId:id
          })
        }).then(res=>res.json())
        .then(result=>{
          const newData = data.map(item=>{
            if(item._id==result._id){
              return result
            }
            else{
              return item
            }
          })
          setData(newData)
        }).catch(err=>{
          console.log(err)
        })
  }
  const unlikePost = (id)=>{
    fetch('/unlike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"hello "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result
        }
        else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err)
    })
}
const makeComment = (text,postId)=>{
  fetch('/comment',{
    method:"put",
    headers:{
      "Content-type":"application/json",
      "Authorization":"hello "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      // name,
      postId,
      text
    })
  }).then(res=>res.json())
  .then(result=>{
    console.log(result)
    const newData = data.map(item=>{
      if(item._id==result._id){
        return result
      }
      else{
        return item
      }
      
    })
    setData(newData)
  }).catch(err=>{
    console.log(err)
  })
}
const deletePost = (postId) =>{
  fetch(`/deletepost/${postId}`,{
    method:"delete",
    headers:{
      "Authorization":"hello "+localStorage.getItem("jwt")
    }
  }).then(res=>res.json())
  .then(result=>{
    console.log(result)
    const newData = data.filter(item=>{
      return item._id !== result._id
    })
    setData(newData)
  })
}
const deleteComment = (postid, commentid) => {
   
  fetch(`/deletecomment/${postid}/${commentid}`, {
    method: "delete",
    headers: {
      Authorization: "hello " + localStorage.getItem("jwt"),
    },
  })
    .then((res) => res.json())
    .then((result) => {
           const newData = data.map((item) => {

        if (item._id == result._id) {
                   return result;
        } else {
          return item;
        }
      });
      setData(newData);
    });
};


  return (
    // <h1>Home</h1>
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key ={item._id}>
            <h5><Link to={item.postedBy._id != state._id ?"/profile/"+item.postedBy._id :"/profile/" }>{item.postedBy.name} </Link>
            {item.postedBy._id == state._id
             && <i class="material-icons"style={{float:"right"}}
             onClick={()=>deletePost(item._id)}>delete</i>
             }          
            </h5>
            <div className="card-image">
              <img src={item.photo}/>
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              
              {item.likes.includes(state._id)
              ?<i className="material-icons" onClick={()=>{unlikePost(item._id)}}> thumb_down</i>
              :
              <i className="material-icons" onClick={()=>{likePost(item._id)}}
              >thumb_up  </i>
            }
              
              {/* <i className="material-icons" onClick={()=>{unlikePost(item._id)}}> thumb_down</i> */}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {
                item.comments.map(record=>{
                  // console.log(record.postedBy.name)
                  return (
                    // <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span>{" "}{record.text}
                    // {(item.postedBy._id || record.postedBy._id) == state._id && (
                    // <i className="material-icons" 
                    // style={{floast:"right"}} 
                    // onClick={()=>
                    //   deleteComment(item._id,record._id)
                    // }
                    //   >
                    //   delete
                    //   </i>
                    // )}
                    // </h6> 
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}
                      </span>{" "}
                      {record.text}
                      {(item.postedBy._id || record.postedBy._id) ==
                        state._id && (
                        <i
                          className="material-icons"
                          style={{
                            float: "right",
                          }}
                          onClick={() => deleteComment(item._id, record._id)}
                        >
                          delete
                        </i>
                      )}
                    </h6>


                  )
                })
              }
              <form onSubmit ={(e)=>{
                e.preventDefault()
                makeComment(e.target[0].value,item._id)
              }}>
              <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
