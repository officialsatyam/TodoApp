const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const path = require("path");
const { title } = require("process");
const port = 5000;
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://satyam:satyam2121@cluster0.8r9utpx.mongodb.net/todo?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("we are connected now!");
});

//creating schema,which will give some restriction
const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is mandatory",
  },
  day: String,
  task: {
    type: String,
    required: "This field is mandatory",
  },
  from: String,
  upto: String,
});

//now creating document in database
const create = mongoose.model("create", kittySchema);

app.use("/static", express.static("static"));
app.use(express.urlencoded());

app.use(express.urlencoded());
//set the tamplet engine as pug
app.set("view engine", "pug");

//view directory
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.status("200").sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/tasks", (req, res) => {
    res.status("200").sendFile(path.join(__dirname, "views", "task.html"));
  });

app.get("/create", (req, res) => {
  res.status(200).render("create.pug", {
    title: "ToDoList",
  });
});

//to store data in database with the help of mongoose
app.post("/create", (req, res) => {
  const type = req.query.type ? req.query.type : false;
  var myData = new create(req.body);
  myData.save().then(() => {
    if (type && type === "json") {
      return res.status(201).json({
        message: "todo created successfully",
        success: true,
        status: 201,
      });
    }
    res
      .status(200)
      .render("create", { title: "ToDoList", cont: "TASK SUBMITTED" });
  });
});

app.get("/show", (req, res) => {
  const type = req.query.type ? req.query.type : false;
  create.find((err, doc) => {
    if (!err) {
      if (type && type === "json") {
        return res
          .status(200)
          .json({ data: doc, message: "success", status: 200 });
      }
      res.render("show.pug", {
        list: doc,
      });
    } else console.log("error");
  });
});

//edit the form
app.get("/create/:id", (req, res) => {
  const type = req.query.type ? req.query.type : false;
  create.findById(req.params.id, (err, doc) => {
    if (!err) {
      if (type && type === "json") {
        return res.json({ message: "success", data: doc, status: 200 });
      }
      res.render("edit.pug", {
        create: doc,
      });
    } else console.log("error");
  });
});

app.post("/edit", (req, res) => {
  const type = req.query.type ? req.query.type : false;
  create.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        if (type && type === "json") {
          return res.status(200).json({
            message: "edited successfully",
            success: true,
            status: 200,
          });
        }
        res.redirect("show");
      } else {
        console.log("error =" + err);
      }
    }
  );
});

app.put("/edit", (req, res) => {
    const type = req.query.type ? req.query.type : false;
    create.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true },
      (err, doc) => {
        if (!err) {
          if (type && type === "json") {
            return res.status(200).json({
              message: "edited successfully",
              success: true,
              status: 200,
            });
          }
          res.redirect("show");
        } else {
          console.log("error =" + err);
        }
      }
    );
  });

app.get("/create/delete/:id", (req, res) => {
  const type = req.query.type ? req.query.type : false;
  create.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      if (type && type === "json") {
        return res.status(200).json({
          message: "deleted successfully",
          success: true,
          status: 200,
        });
      }
      res.redirect("/show");
    } else {
      console.log("error" + err);
    }
  });
});

app.delete("/todo/:id", (req, res) => {
    const type = req.query.type ? req.query.type : false;
    create.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        if (type && type === "json") {
          return res.status(200).json({
            message: "deleted successfully",
            success: true,
            status: 200,
          });
        }
        res.redirect("/show");
      } else {
        console.log("error" + err);
      }
    });
  });


app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});

/*function save(){
            let sub=document.getElementById("sub");
            let end=document.getElementById("end");
            end.innerHTML="DONE!"
        })*/
