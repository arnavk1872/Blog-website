//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//text that will always remain same in the website.

const homeStartingContent = "Hey! I'm Arnav Khajuria.This is a Personal Blog project that i've made which uses Javascript,Node.js,MongoDB and EJS to function.This Blog can be updated with new posts constantly and is fully functional.The style of every page is made the same with less work with the use of EJS and Node.js,MongoDB has been used for the backend.";
const aboutContent = "Hello.I am Arnav Khajuria.I am pursuing Electronics & Communication Engineering from Government College of Engineering & Technology Jammu,J&K . I am a self taught full stack developer and i have made projects in many front end and backend technologies and frameworks which also includes this project.";
const contactContent = "Contact for inquires <br> Email: arnavk1802@gmail.com , arnavk1872@gmail.com  <br> Twitter : Arnavkhajuria18 <br> Github : github.com/arnavk1872" ;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting  to mongoose locally,making a schema and a mongoose model.

mongoose.connect("process.env.PORT || mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

//In the home route find all the written content and render it along with the heading

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

//in the compose page ask the user for the title of the blog post and the content and save the post while checking for errors

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

//Helps in rendering new pages with the typed content from the compose page using the id.
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//skeleton code

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
