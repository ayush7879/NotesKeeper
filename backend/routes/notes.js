const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");
// const fetchuser= require('../middleware/fetchuser');
// ROUTE : 1 Show notes to user through get request
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE:2 adding notes through post request
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const notesaved = await note.save();
      res.json(notesaved);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//ROUTE :3 update an existing note
router.put("/updatenote/:id",fetchuser, async (req, res) => {
const {title,description,tag}=req.body;
const newNote={};
if(title){
  newNote.title=title;
}
if(description){
  newNote.description=description;
}
if(tag){
  newNote.tag= tag;
}
//Find note to be updated
let note=await Notes.findById(req.params.id);
// res.json({notes:note.user});
if(!note){
  return res.status(404).send("Not Found");
}
if( note.user.toString()!==req.user.id){
return res.status(401).send("Not Allowed");
}
note= await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json({note});
  })


//ROUTE :4 update and delete note
router.delete("/deletenote/:id",fetchuser, async (req, res) => {
  const {title,description,tag}=req.body;
  //Find note to be updated
  let note=await Notes.findById(req.params.id);
  // res.json({notes:note.user});
  if(!note){
    return res.status(404).send("Not Found");
  }
  if( note.user.toString()!==req.user.id){
  return res.status(401).send("Not Allowed");
  }
  note= await Notes.findByIdAndDelete(req.params.id);
  res.json({"Success": "DELETED",note:note});
    })

module.exports = router;
