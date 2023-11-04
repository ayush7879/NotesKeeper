import React,{useContext} from 'react'
import { useEffect,useRef,useState } from 'react';
import noteContext from '../context/NoteContext'
import AddNote from './AddNote';
import Noteitem from "./Noteitem"
import { useNavigate } from "react-router-dom";
function Notes(props) {
    const history= useNavigate();
    const context= useContext(noteContext);
    const {note,getnote,editnote}=context;
    useEffect(() => {
        if(localStorage.getItem('token')){
console.log(localStorage.getItem('token'));
            getnote();
            // eslint-disable-next-line
        }
        else{
            history('/login');
        }
        
    }, [])
    const ref = useRef(null)
    const refClose = useRef(null)
    const [notes, setnotes] = useState({id: "", etitle: "", edescription: "", etag: ""})
    const updatenotes=(currentNote)=>{
      ref.current.click();
      setnotes({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag:currentNote.tag})
    
    }
    const onChange = (e)=>{
      setnotes({...notes, [e.target.name]: e.target.value})
  }
  const handleclick=(e)=>{
      e.preventDefault();
    editnote(notes.id,notes.etitle,notes.edescription,notes.etag)
    refClose.current.click();
    props.showalert("Updated Successfully","success");
  }
  return (
    <>
    <AddNote showalert={props.showalert}/>
    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={notes.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={notes.edescription} onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={notes.etag} onChange={onChange} />
                                </div>
 
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={notes.etitle.length<5 || notes.edescription.length<5} type="button" className="btn btn-primary"onClick={handleclick}>Update Note</button>
                        </div>
                        </div>
                </div>
            </div>


    <div className="row my-3">
    <h2> Your Notes</h2>
    <div className="container mx-2"> 
                {note.length===0 && 'No notes to display'}
                </div>
    {note.map((notes)=>{
        return <Noteitem key= {notes._id}   updatenotes={updatenotes}  showalert={props.showalert}  note={notes}/>;
    })}

    </div>
    </>
  )
}

export default Notes