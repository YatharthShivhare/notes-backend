const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
mongoose.connect("mongodb://localhost:27017/notesDB", () => { console.log("Mongoose connection state:" + mongoose.connection.readyState); });
const port = 3001;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const noteSchema = {
    title: String,
    content: String
};
const note = mongoose.model("note", noteSchema);

app.route("/")
    .get((req, res) => {
        console.log("Hello world");
        res.send("Hello world");
    });

app.route("/notes")
    .get((req, res) => {
        note.find({}).lean()
            .then((queryAns) => {
                console.log("Successfully retrieved all notes.");
                res.send(queryAns);
            })
            .catch((err) => {
                console.log("An error occurred while finding the notes:");
                console.log(err);
            })
    })
    .post((req, res) => {
        const newNote = new note({
            title: req.body.title,
            content: req.body.content
        });
        newNote.save((err) => {
            if (err) {
                console.log("An error occurred while saving the note to the database:");
                console.log(err);
            }
            else {
                console.log("New note saved successfully.")
                res.send("New note saved successfully.")
            }
        });
    });

app.route("/notes/:_id")
    .delete((req, res) => {
        note.deleteOne({ _id: req.params._id })
            .then(() => {
                console.log("Successfully deleted note:"+req.params._id);
                res.send("Successfully deleted note:"+req.params._id);
            })
            .catch((err) => {
                console.log("An error occurred while deleting the note:"+req.params._id+":");
                console.log(err);
            });
    })
    .patch((req, res) => {
        console.log(req.params._id);
        note.updateOne({ _id: req.params._id }, {$set:req.body})
            .then(() => {
                console.log("Successfully edited note:"+req.params._id);
                res.send("Successfully edited note:"+req.params._id);
            })
            .catch((err) => {
                console.log("An error occurred while editing the note:"+req.params._id+":");
                console.log(err);
            });
    })

app.listen(port, () => {
    console.log("Server running at port:" + port);
});