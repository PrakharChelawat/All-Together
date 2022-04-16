import React,{useState,useContext,} from "react";
import {Link,useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'
// import { UserContext } from '../../App'
const Newpassword = () => {
  const history=useHistory()
  // const [name,setName] =useState("")
  const [password,setPassword]=useState("")
  const {token} = useParams()
  console.log(token)
  // const send
  const PostData =() =>{
    
    fetch('/new-password',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
       
        password,
        token
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data)
      if(data.error){
      M.toast({html: data.error,classes:"#f44336 red"})
    }
    else{
      
      M.toast({html:data.message,classes:"#4caf50 green"})
      history.push("/signin")
    }
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    // <h1>Login</h1>
    <>
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>All-Together</h2>
        
        <input type="password" placeholder="enter new password" 
        value={password}
        onChange ={(e) =>setPassword(e.target.value)}/>
        <button
          className="btn waves-effect waves-light #3d5afe indigo accent-3"
          onClick={()=>PostData()}
        >
          Reset Password
        </button>
        {/* <h5><Link to="/signup">Don't have an account ?</Link></h5> */}
      </div>
    <br/>
    <br/>
    <br/>
    
    </div>
    
  </>
  );
};
export default Newpassword;
