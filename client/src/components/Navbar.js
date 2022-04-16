import React ,{Component, useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import { render } from 'react-dom';
import M from 'materialize-css'


const NavBar = ()=>{
  const searchModal =useRef(null)
  const {state,dispatch} = useContext(UserContext)
  const [search,setSearch]=useState("")
  const [userDetails,setUserDetails]=useState([])
  const history =useHistory()
  useEffect (()=>{
      M.Modal.init(searchModal.current)
  },[])
  const renderList =() =>{
    // console.log("test")
    if(state){
      
      return [
        <li key="1" style={{cursor:"pointer",color:"black"}}><i className="large material-icons modal-trigger" data-target="modal1">search</i></li>,
        <li key="2"><Link to="/">Home</Link></li>,
        <li key="3"><Link to="/profile">Profile</Link></li>,
        <li key="4"><Link to="/create">Create</Link></li>,
        <li key="5"><Link to="/myfollowingpost">My Following Post</Link></li>,
        
        <li>
          <button
          className="btn #b71c1c red darken-4"
          onClick={()=>
          {
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push("/signin")
          }}
        >
          Logout
        </button>
        </li>
      ]
    }
    else{
      return [
        <li key="6"><Link to="/signin" className="self2">Sign-in</Link></li>,
        <li key="7"><Link to="/signup" className="self2">Sign-up</Link></li>,
      ]
    }
    
  }
  const fetchUsers = (query) =>{
      setSearch(query)
      fetch('/search-users',{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          query
        })
      }).then(res=>res.json())
      .then(results=>{
        // console.log(results)
        setUserDetails(results.user)
      })
  }
    return(
     <>
    <nav>
    <div className="nav-wrapper #bbdefb blue lighten-4">
    
      <Link to={state?"/":"/signin"} className="brand-logo center" >All-Together</Link>
      
      
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {renderList()}
        
      </ul>  
      
    </div> 
    
  </nav>
  <ul class="sidenav" id="mobile-demo">
    {/* <li><Link to="/">About Us</Link></li>
    <li><Link to="/signin">Sign-in</Link></li>
    <li><Link to="/signup">Sign-up</Link></li> */}
    {renderList()}
  </ul>
  {/* <!-- Modal Structure --> */}
  <div id="modal1" className="modal" ref={searchModal}>
    <div className="modal-content">
    <input type="text" placeholder="search-users" 
        value={search}
        onChange ={(e) =>fetchUsers(e.target.value)}/>
        <ul className="collection">
          {
            userDetails.map(item=>{
              return <Link to={ item._id !== state._id?"/profile/"+item._id:"/profile"}
                    onClick={()=>{
                      M.Modal.getInstance(searchModal.current).close()
                      setSearch('')
                    }}
              
              ><li className="collection-item">{item.email}</li></Link>
            })
          }
    </ul>
    </div>
    <div class="modal-footer">
      <a href="#!" className="modal-close waves-effect red btn-flat" onClick={()=>setSearch('')}>close</a>
    </div>
  </div>
  </>
    )
}
export default NavBar
