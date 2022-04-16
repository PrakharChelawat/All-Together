import React,{useState,useContext,} from "react";
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
const Signin = () => {
  const {state,dispatch}=useContext(UserContext)
  const history=useHistory()
  // const [name,setName] =useState("")
  const [password,setPassword]=useState("")
  const [email,setEmail]=useState("")
  // const send
  const PostData =() =>{
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
      M.toast({html:"Invalid Email",classes:"#f44336 red"})
      return
    }
    fetch('/signin',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        // name,
        password,
        email
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data)
      if(data.error){
      M.toast({html: data.error,classes:"#f44336 red"})
    }
    else{
      localStorage.setItem("jwt",data.token)
      localStorage.setItem("user",JSON.stringify(data.user))
      dispatch({type:"USER",payload:data.user})
      M.toast({html:"Signed In Successfully",classes:"#4caf50 green"})
      history.push("/")
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
        <input type="text" placeholder="email" 
        value={email}
        onChange ={(e) =>setEmail(e.target.value)}/>
        <input type="password" placeholder="password" 
        value={password}
        onChange ={(e) =>setPassword(e.target.value)}/>
        <button
          className="btn waves-effect waves-light #3d5afe indigo accent-3"
          onClick={()=>PostData()}
        >
          login
        </button>
        <h5><Link to="/signup">Don't have an account ?</Link></h5>
        <h6><Link to="/reset">Forget Password</Link></h6>
      </div>
    <br/>
    <br/>
    <br/>
    
    </div>
    
  </>
  );
};
export default Signin;
