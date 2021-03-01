import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link} from 'react-router-dom';
import M from 'materialize-css'

const Navbar=()=>{
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
     useEffect(()=>{
         M.Modal.init(searchModal.current)
     },[])
    const links=()=>{
        if(localStorage.getItem("jwt")===null)
        {return(
            <div>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
            </div>
        )   
        }
        else
        {
            return(
                <div>
                    <li><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/create">Create Post</Link></li>
                    <li><Link to="/home">Explore</Link></li>
                    <button className="btn red"
                        onClick={()=>{localStorage.clear()
                        window.location.replace('/login')}}>Logout
                    </button>
                </div>
            )
        }
    }
    
    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/profile/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }
     
    return(
    <nav>
        <div className="nav-wrapper white">
        <Link to="/" className="brand-logo left">IPUgram</Link>
        <ul id="nav-mobile" className="right">            
            {links()}
        </ul>
        </div>
        <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== JSON.parse(localStorage.getItem("user"))._id ? "/profile/user/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>
    </nav>
    );
}

export default Navbar;