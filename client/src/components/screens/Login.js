import react,{useState}  from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Login=()=>{
    const history=useHistory();
        const [password,setPassword]=useState("");
        const [email,setEmail]=useState("");
        const PostData=()=>{
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
                M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
                return
            }
            fetch("/login",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                 }
                 else{
                     M.toast({html:"Signed in successfully",classes:"#43a047 green darken-1"})
                     localStorage.setItem('jwt',data.token);
                     localStorage.setItem('user',JSON.stringify(data.user));
                     window.location.replace('/');
                 }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    return(
        <div className="mycard">
            <div className="card card-box">
                <h2>IPUgram</h2>
                <input type="text" placeholder="email"
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}></input>
                <input type="text" placeholder="password"
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}></input>
                <button class="btn waves-effect waves-light"
                onClick={()=>PostData()}>Login
                </button>
                <br/>
                <h6><Link to="/signup">Don't have an account?</Link></h6>
                <Link to="/reset-password">Forgot Password?</Link>
            </div>
        </div>
    )
}

export default Login;