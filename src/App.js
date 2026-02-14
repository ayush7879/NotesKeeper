
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
<<<<<<< HEAD
import Chat from "./components/Chat";
=======
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
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
<<<<<<< HEAD
          <Route exact path="/" element={<Home showalert={showalert}/>}></Route>
          <Route exact path="/about" element={<About />}></Route>
          <Route exact path="/login" element={<Login showalert={showalert} />}></Route>
          <Route exact path="/signup" element={<Signup  showalert={showalert}/>}></Route>
          <Route exact path="/chat" element={<Chat showalert={showalert} />}></Route>
=======
          <Route exact path="/"element={<Home showalert={showalert}/>}></Route>
          <Route exact path="/about"element={<About />}></Route>
          <Route exact path="/login"element={<Login showalert={showalert} />}></Route>
          <Route exact path="/signup"element={<Signup  showalert={showalert}/>}></Route>
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
        </Routes>
        </Router>
        </div>
        </NoteState>
    </>
  );
}

export default App;
