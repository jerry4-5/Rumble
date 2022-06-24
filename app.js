//jshint esversion : 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const https = require("https");
const request = require("request");


mongoose.connect('mongodb+srv://admin-angela:Test123@cluster0.nbxhk.mongodb.net/journalDB', {
  useNewUrlParser: true
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



const postSchema = {
  title: {
    type: String,
    required: [true, "Error! Enter data correctly"]
  },
  post: String
};


const Post = mongoose.model("Post", postSchema);


app.get("/home", function(req, res) {
      //console.log(posts);


      Post.find({}, function(err, results) {

        if (err) {
            console.log(err);
          } else {
            //console.log(results);
            res.render("home", {
              postArray: results
            });
          }
      });
      });




app.get("/",function(req,res){
  res.send("\index.html");
});


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  //console.log(req.body.postTitle);

  const newPost = new Post({
    title: req.body.postTitle,
    post: req.body.postBody
  });
  newPost.save(function(err){
    if(!err){
      res.redirect("/home");
    }
  });
});


app.get("/posts/:postName", function(req, res) {
  const id = req.params.postName;
  Post.findById({_id: id},function(err,result){
    if(!err)
    {
      res.render("post", {
        element : result
      });
    }
  });
});



app.post("/",function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAdd = req.body.emailadd;
  // console.log(firstName);
  // console.log(lastName);
  // console.log(emailadd);
  const data = {
    members: [
      {
      email_address: emailAdd,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};
const jsonData = JSON.stringify(data);

const url = "https://us14.api.mailchimp.com/3.0/lists/2c29f8e965";

const options = {
  method: "POST",
  auth: "isha:4d375bb10dd204cfa84785b3f229fd3d-us14"
};

const request = https.request(url, options, function(response){

  if(response.statusCode === 200){
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname+"/failure.html");
  }
  response.on("data", function(data){
    console.log(JSON.parse(data));
  });
});
request.write(jsonData);
request.end();
});


app.get("/about",function(err){
  if(!err){
    res.render("about");
  }
});

app.get("/contact",function(err){
  if(!err){
    res.render("contact");
  }
});


app.post("/failure",function(req,res){
  res.redirect("/");
});




let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
