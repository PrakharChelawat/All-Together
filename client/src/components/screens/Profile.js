import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [readMore,setReadMore]=useState(false);
  const [data, setData] = useState([]);
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  // const [url,setUrl]=useState(undefined)
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "hello " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "prakhar123");
      fetch("	https://api.cloudinary.com/v1_1/prakhar123/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // setUrl(data.url)
          console.log(data)
          //
          //
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "hello " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatepic = (file) => {
    setImage(file);
  };
const deleteId = (id) =>{
    fetch(`/deleteId/${id}`,{
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

  const x=readMore?'  Read Less << ':' Read More >> '
  return (
    // <h1>Profile</h1>
    
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px",padding:"20px 20px 20px 20px"}}
            src={state ? state.pic : "loading"}
          />
        </div>

        <div>
          

          <h5><b>{state ? state.name : "loading"}</b></h5>
          <h6>  {state ? state.email : "loading"}</h6>
          <h6> {state ? state.phone : "loading"}</h6>
          <p><i>{state ? 
          <>
          <a style={{justifyContent:true}}>{!readMore && state.aboutus.slice(0,state.aboutus.length/8)}</a>
          <a onClick={()=>{setReadMore(!readMore)}}><i className="read-more-link">{readMore && state.aboutus.slice(0,state.aboutus.length)}{" "}<a className="read-more-link"><b>{x}</b></a>
          </i>
          </a>
          </>
          : "loading"}</i></p>
          <div className="file-field input-field">
            <div className="btn-small  #3d5afe indigo accent-3">
              <span>Edit Pic</span>
              <input
                type="file"
                onChange={(e) => updatepic(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h5>{mypics.length} posts</h5>
            <h5>{state ? state.followers.length : "0"} followers</h5>
            <h5>{state ? state.following.length : "0"} following</h5>
            <br></br>  
          </div>
        </div>
      </div>
      {/* <a class='dropdown-trigger btn' data-activates="dropdown">Drop Me!</a>
       */}
      


    
    <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
    
  );
  
};
export default Profile;
