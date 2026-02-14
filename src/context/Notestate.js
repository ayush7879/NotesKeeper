import React from "react";
import { useState } from "react";
import noteContext from "./NoteContext";
const NoteState=(props)=>{
  const host= "http://localhost:5000"
  // const host="https://notebook-p0td.onrender.com"
    const initialnote=[]
    const [note, setnote] = useState(initialnote);

 //Get all NOTE
 const getnote=async()=>{
<<<<<<< HEAD
  try {
    //API CALL
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json(); 
    setnote(json);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
=======
  //API CALL
  const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    },
  });
  const json = await response.json(); 
 setnote(json);
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
}


    
    //ADD NOTE
const addnote=async(title,description,tag)=>{
<<<<<<< HEAD
  try {
    //API CALL
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
=======
  //API CALL
  const response = await fetch(`${host}/api/notes/addnotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({title, description, tag})
  });
  const notes = await response.json(); 
  setnote(note.concat(notes))

}

    //DELETE NOTE
const deletenote=async(id)=>{

  const response = await fetch(`${host}/api/notes//deletenote/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    },

  });
 const json= response.json;
  const notesafterdelete = note.filter((noted) => { return noted._id !== id })
  setnote(notesafterdelete)
}

    //EDIT NOTE
    const editnote=async(id,title,description,tag)=>{
       // API Call 
    const response = await fetch(`${host}/api/notes//updatenote/${id}`, {
     
      method: 'PUT',
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
<<<<<<< HEAD
    const notes = await response.json(); 
    setnote(note.concat(notes))
  } catch (error) {
    console.error("Error adding note:", error);
  }
}

    //DELETE NOTE
const deletenote=async(id)=>{
  try {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    const notesafterdelete = note.filter((noted) => { return noted._id !== id })
    setnote(notesafterdelete)
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

    //EDIT NOTE
    const editnote=async(id,title,description,tag)=>{
      try {
        // API Call 
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        let newnotes= JSON.parse(JSON.stringify(note));
        for (let index = 0; index < newnotes.length; index++) {
          if(newnotes[index]._id===id){
            newnotes[index].title=title;
            newnotes[index].description=description;
            newnotes[index].tag=tag;
            break;
          }
        }
        setnote(newnotes);
      } catch (error) {
        console.error("Error updating note:", error);
      }
=======
 let newnotes= JSON.parse(JSON.stringify(note));
for (let index = 0; index < newnotes.length; index++) {
  if(newnotes[index]._id===id){
    newnotes[index].title=title;
    newnotes[index].description=description;
    newnotes[index].tag=tag;
    break;
  }
}
setnote(newnotes);
>>>>>>> 681fd569d3b3d716cf314a41e4d118bce54883f4
    }
return (
   <noteContext.Provider value={{note,addnote,deletenote,editnote,getnote}}>
    {props.children}
   </noteContext.Provider>
)
}
export default NoteState;
