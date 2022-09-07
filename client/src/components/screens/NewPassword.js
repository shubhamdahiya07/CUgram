import react,{useState}  from 'react';
import {Link,useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';

const Login=()=>{
    const history=useHistory();
    const {token}=useParams();
        const [password,setPassword]=useState("");
        const PostData=()=>{
            fetch("/new-password",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    password,token
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                 }
                 else{
                     M.toast({html:data.message,classes:"#43a047 green darken-1"})
                     history.push('/login');
                 }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    return(
        <div className="mycard">
            <div className="card card-box">
                <h2>CUgram</h2>
                <input type="password" placeholder="Enter new password"
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}></input>
                <button class="btn waves-effect waves-light"
                onClick={()=>PostData()}>Set Password
                </button>
              </div>
        </div>
    )
}

export default Login;