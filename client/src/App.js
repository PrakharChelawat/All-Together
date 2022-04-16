import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route, Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import CreatePost from './components/screens/createpost'
import {reducer,intialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubcribesUserPosts from './components/screens/SubscribesUserPosts'
// import Aboutus from './components/screens/Aboutus'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'
export const UserContext = createContext()

const Routing = () =>{
  const history =useHistory()
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
    console.log(typeof(user),user)
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push("/")
    }
    else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/signin')
      }
      
    }
  },[])
  return (
    <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    {/* first tab for seeing placement related activities */}
    <Route exact path="/">
      <Home/>
    </Route>
    {/* second tab for seeing cultural related activities */}
    {/* <Route exact path="/">
      <Home/>
    </Route> */}
    <Route path="/signin">
      <Signin />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    {/* <Route path="/aboutus">
      <Aboutus/>
    </Route> */}
    <Route exact path="/profile">
      <Profile />
    </Route>
    <Route path="/profile/:userid">
      <UserProfile />
    </Route>
    <Route path="/myfollowingpost">
      <SubcribesUserPosts />
    </Route>
    <Route path="/create">
      <CreatePost />
    </Route>
    <Route exact path="/reset">
      <Reset />
    </Route>
    <Route  path="/reset/:token">
      <Newpassword />
    </Route>
    </Switch>
  );
}


function App() {
  const [state,dispatch]=useReducer(reducer,intialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <NavBar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
