
// import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import About from "./components/About";
import Alert from "./components/Alert";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import NoteState from "./context/Notestate";
import { useState } from "react";
function App() {
  const [alert, setalert] = useState(null);
  const showalert=(message,type)=>{
    setalert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      setalert(null);
    }, 1500);
      }
  return (
    <>
    < NoteState>
    <div className="container-fluid">
    <Router>
     <Navbar/>
<Alert alert={alert}/>
     <Routes>
          <Route exact path="/"element={<Home showalert={showalert}/>}></Route>
          <Route exact path="/about"element={<About />}></Route>
          <Route exact path="/login"element={<Login showalert={showalert} />}></Route>
          <Route exact path="/signup"element={<Signup  showalert={showalert}/>}></Route>
        </Routes>
        </Router>
        </div>
        </NoteState>
    </>
  );
}

export default App;
