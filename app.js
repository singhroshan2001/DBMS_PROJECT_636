//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("Public"));

mongoose.connect('mongodb+srv://admin-amit:@Mit071100@cluster0.vghtf.mongodb.net/todolistDB', {
  useNewUrlParser: true
});

// var items=["Buy Food","Cook Food","Eat Food"];
// var workItem=[];

const itemSchema = new mongoose.Schema({
  name: String
});

const item = mongoose.model("item", itemSchema);
var day = "";
const item1 = new item({
  name: "Welcome"
});

const item2 = new item({
  name: "Hit + to Add item"
});

const defaultItems = [item1, item2];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  day = today.toLocaleDateString("en-US", options);
  item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      item.insertMany(defaultItems, function(err) {
        if (err)
          console.log(err);
        else
          console.log("Success");
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItem: foundItems
      });
    }
  });

});
let port = process.env.PORT;
if (port == null || port == ""){
    port =3000;
}
app.listen(port, function() {
  console.log("Server started.");
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item3 = new item({
    name: itemName
  });
  if (listName === day) {
    item3.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item3);
      foundList.save();
      res.redirect("/" + listName);
    });
}
  //  if (req.body.list==="Work")
  //  {
  //    workItem.push(item);
  //    res.redirect("/work");
  //  }
  //  else
  //  {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req, res) {
  const listName = req.body.listName;
  const checkedItemId = req.body.checkbox;

  if (listName === day) {
    item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  } else {
    list.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err)
        res.redirect("/" + listName);
    });
  }


});


app.get("/:customListName", function(req, res) {
  const custom = _.capitalize(req.params.customListName);

  List.findOne({
    name: custom
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: custom,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + custom);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items
        })
      }
    } else {
      console.log(err);
    }
  });
});

// app.get("/work", function(req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItem: workItem
//   });
// });
//
// app.get("/about", function(req, res) {
//   res.render("about");
// });
