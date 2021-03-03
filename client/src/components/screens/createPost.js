import react,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

const CreatePost=()=>{
    const history=useHistory();
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
        fetch("/posts/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                url
            })
        }).then(res=>res.json())
        .then(data=>{
        if(data.error){
            M.toast({html: data.error,classes:"#c62828 red darken-3"})
        }
        else{
            M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
            history.push('/')
        }
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url]);

    const postDetails = ()=>{
        if(image)
        {
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
                console.log(data.url);
               setUrl(data.url)
            })
            .catch(err=>{
                console.log(err)
            })        
        }
        else
        {
            M.toast({html: "Image not uploaded",classes:"#c62828 red darken-3"})
        }
    }

    return(
        <div className="card input-filed" style={{margin:"40px auto",
        padding:"20px", textAlign:"center",maxWidth:"500px"}}>
            <input type="text" placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}></input>
            <input type="text" placeholder="body"
            value={body}
            onChange={(e)=>setBody(e.target.value)}></input>
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input type="file"
                    onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files"
                    />
                </div>
            </div>
            <button class="btn waves-effect waves-light"
            onClick={()=>postDetails()}>Submit Post
            </button>
        </div>
    )
}

export default CreatePost;