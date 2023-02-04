const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect("mongodb+srv://ashu24998:<myPassword>@cluster0.xgfoy2i.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String
});

const ItemModel = mongoose.model("Item", itemsSchema);

const item1 = new ItemModel({
  name: "Get Up"
})

const item2 = new ItemModel({
  name: "Brush Teeth"
})

const item3 = new ItemModel({
  name: "Breakfast"
})

const defaultArray = [item1, item2, item3];

app.get("/", function(req, res) {

  ItemModel.find(function(err, items) {
    if(items.length === 0) {
      ItemModel.insertMany(defaultArray, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("Success");
        }
      })
      res.redirect("/");
    } else {
        const day = date.getDate();
        res.render("list", {listTitle: day, newListItems: items});
      }
    })
  });

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    const nextItem = new ItemModel({
      name: item
    })
    nextItem.save();
    res.redirect("/");
  }
});

app.post("/delete", function(req, res){
  const checkedItem = req.body.checkbox;
  ItemModel.findByIdAndDelete(checkedItem, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Successfully deleted.");
      res.redirect("/");
    }
  })
});

// app.get("/:path", function(req, res) {
//   const newPath = req.params.path;
//   ItemModel.findOne({name: newPath}, function(err, results) {
//     if(!err) {
//       if(!results) {
//         console.log("Doesn't exists.");
//       }
//       else {
//         console.log("Exists.");
//       }
//     }
//   });
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
