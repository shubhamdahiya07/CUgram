import react,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';

const Home=()=>{
    const [data,setData]=useState([])
    useEffect(()=>{
        fetch('/posts/explore',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
             }
             else
             {
                setData(result.posts)
             }   
        })
     },[])

     const likePost = (id)=>{
        fetch('/posts/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                 //   console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }
  const unlikePost = (id)=>{
        fetch('/posts/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
          //   console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
          console.log(err)
      })
  }

  const makeComment = (text,postId)=>{
    fetch('/posts/comment',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            text
        })
    }).then(res=>res.json())
    .then(result=>{
        const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
       })
      setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}

const deletePost = (postid)=>{
    fetch('posts/deletepost/'+postid,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
}

    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div key={item._id} className="card home-card">
                        <h5 style={{padding:"5px"}}> {<Link to={item.postedBy._id !== JSON.parse(localStorage.getItem("user"))._id ?"/profile/user/"+item.postedBy._id:"/profile"}>{item.postedBy.name}</Link>}{item.postedBy._id == JSON.parse(localStorage.getItem("user"))._id 
                            && <i className="material-icons" 
                            style={{
                                float:"right"
                            }} 
                            onClick={()=>deletePost(item._id)}>delete</i>
                        }
                        </h5>
                        <div className="card-image">
                            <img src={item.image}/>
                        </div>
                        <div className="card-content">
                        {
                            item.likes.includes(JSON.parse(localStorage.getItem("user"))._id)
                            ? 
                             <i className="material-icons" style={{color:"blue"}}
                                    onClick={()=>{unlikePost(item._id)}}
                              >thumb_up</i>
                            : 
                            <i className="material-icons"
                            onClick={()=>{likePost(item._id)}}
                            >thumb_up</i>
                            }
                        <h6>{item.likes.length} likes</h6>
                        <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                            }
                            <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                  <input type="text" placeholder="add a comment" />  
                            </form>
                        </div>
                    </div>
                    )
                })
            }
           
        </div>
    )
}

export default Home;