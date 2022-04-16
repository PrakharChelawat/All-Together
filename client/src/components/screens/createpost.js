import React,{useState,useEffect} from "react";
import M from 'materialize-css'
import {Link,useHistory} from 'react-router-dom'
const CreatePost = () => {
  const [title,setTitle]=useState("")
  const [body,setBody]=useState("")
  const [image,setImage]=useState("")
  const [url,setUrl]=useState("")
  const [phone,setPhone]=useState("")
  const [address,setAddress]=useState("")
  
  const history=useHistory()
  useEffect(()=>{
    if(url){
      fetch('/createpost',{
        method:"post",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"hello "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          title,
          body,

          pic:url,
          phone,
          address,
        })
      }).then(res=>res.json())
      .then(data=>{
        // console.log(data)
        if(data.error){
        M.toast({html: data.error,classes:"#f44336 red"})
      }
      else{
        M.toast({html:"Created Post SuccessFully",classes:"#4caf50 green"})
        history.push("/")
      }
      }).catch(err=>{
        console.log(err)
      })
    }

  },[url])
  const postDetails =() =>{
    const data= new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","prakhar123")
    fetch("	https://api.cloudinary.com/v1_1/prakhar123/image/upload",{
      method:"post",
      body:data,
    }).then(res=>res.json())
    .then(data=>{
      // console.log(data)
      setUrl(data.url)
    }).catch(err=>{
      console.log(err)
    })
    
  }
  return (
    <div className="card input-filled">
      <input type="text" placeholder="Name / Title" 
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      />
      <input type="text" placeholder="Description" 
      value={body}
      onChange={(e)=>setBody(e.target.value)}/>
      
      <input type="text" placeholder="Phone" 
      value={phone}
      onChange={(e)=>setPhone(e.target.value)}
      />
      <input type="text" placeholder="Address" 
      value={address}
      onChange={(e)=>setAddress(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn  #3d5afe indigo accent-3">
          <span>Upload Image</span>
          <input type="file" 
          onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
        
      </div>
      
      <button
          className="btn waves-effect waves-light #3d5afe indigo accent-3"
          onClick={()=>postDetails()}
          >
          Submit Post
        </button>
    </div>
  );
};
export default CreatePost;
