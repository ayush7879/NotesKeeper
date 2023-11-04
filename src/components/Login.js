import React , {useState} from 'react'
import { useNavigate } from "react-router-dom";
const Login = (props) => {
    let history= useNavigate();
    const [credentials, setCredentials] = useState({email:"", password:""}) 

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        if(json.success){
           localStorage.setItem('token',json.authtoken);
           props.showalert("Account Login Successfully","success");
          
          history('/');
        }
        else{
            props.showalert("Invalid Credential","danger");
        }
        console.log(json);
    }
  return (
    <div className='container mt-3'>
        <h2>Login to Continue to Notebook</h2>
    <form  onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control"  onChange={onChange} value={credentials.email} id="email" name="email" aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
</div>
  )
}

export default Login