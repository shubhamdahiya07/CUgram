import react,{useEffect,useState} from 'react';

const Profile=()=>{
    const [mypics,setPics] = useState([])
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");

    useEffect(()=>{
       fetch('/posts/myposts',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           setPics(result.posts)
       })
    },[])

    useEffect(()=>{
        if(image){
         const data = new FormData()
         data.append("file",image)
         data.append("upload_preset","IPUgram")
         data.append("cloud_name","sheft")
         fetch("https://api.cloudinary.com/v1_1/sheft/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json())
         .then(data=>{
            fetch('/profile/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                const user=JSON.parse(localStorage.getItem("user"));
                user.pic=result.pic;
                localStorage.setItem("user",JSON.stringify({...JSON.parse(localStorage.getItem("user")),pic:result.pic}))
                window.location.reload()
            })
         })
         .catch(err=>{
             console.log(err)
         })
        }
     },[image])

    const updatePhoto = (file)=>{
        setImage(file);
    }


    return(
    <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{
            margin:"20px 0px",
            borderBottom:"1px solid grey"
        }}>

        <div style={{
            display:"flex",
            justifyContent:"space-around",
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={JSON.parse(localStorage.getItem("user")).pic}
                ></img>
            </div>
            <div>
                
            <h4>{JSON.parse(localStorage.getItem("user")).name}</h4>
            <h5>{JSON.parse(localStorage.getItem("user")).email}</h5>
                <div style={{display:"flex",justifyContent:"space-around",width:"108%"}}>
                <h6>{mypics.length} posts</h6>
                <h6>{JSON.parse(localStorage.getItem("user")).followers.length} followers</h6>
                <h6>{JSON.parse(localStorage.getItem("user")).following.length} following</h6>
                </div>
            </div>
        </div>
        <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Profile Picture</span>
                    <input type="file"
                    onChange={(e)=>updatePhoto(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"
                    />
                </div>
            </div>
        </div>

        
        <div className="gallery">
            {
                mypics.map(pic=>{
                    return(
                        <img className="pic" key={pic._id} src={pic.image} alt={pic.title}/>
                    )
                })
            }
        </div>
    </div>
    )
}

export default Profile;