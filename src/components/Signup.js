import React , {useState} from 'react'
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
    let history= useNavigate();
    const [credentials, setCredentials] = useState({name:"",email:"", password:"",cpassword:""}) 
    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: credentials.name,email: credentials.email, password: credentials.password})
        });
        if(credentials.password===credentials.cpassword){
        const json = await response.json()
        if(json.success){
           localStorage.setItem('token',json.authtoken);
           history('/');
           props.showalert("Account Created Successfully","success");
           console.log(json);
        }
        else{
           props.showalert("Invalid Credential","danger");
        }
    }
        else{
            props.showalert("Invalid Credential","danger");
        }
    }
  return (
    <div className='container mt-2'>
    <h2 className='my-2' >SignUp to Continue to Notebook</h2>
    <form  onSubmit={handleSubmit} >
    <div className=" form-group my-3 " >
    <label htmlFor="name"className='form-label ' >Name</label>
    <input type="name" name="name" className="form-control  " value={credentials.name} onChange={onChange}  id="name" aria-describedby="emailHelp" placeholder="Enter Name"/>
  </div>
  <div className="form-group  " >
    <label htmlFor="email"className='form-label '>Email address</label>
    <input type="email" name="email" className="form-control  " value={credentials.email} onChange={onChange}  id="email" aria-describedby="emailHelp" placeholder="Enter email"/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group  "  >
    <label htmlFor="password"className='form-label '>Password</label>
    <input type="password" name="password" value={credentials.password} onChange={onChange}  className="form-control " id="password" placeholder="Password" minLength={5}required/>
  </div>
  <div className="form-group  " >
    <label htmlFor="cpassword " className='form-label '>ConfirmPassword</label>
    <input type="password" name="cpassword" value={credentials.cpassword} onChange={onChange}  className="form-control " id="cpassword" placeholder="Password" minLength={5}required/>
  </div>
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
   </div>
  )
}

export default Signup