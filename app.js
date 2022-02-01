//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

//text that will always remain same in the website.

const homeStartingContent = "Hey! I'm Arnav Khajuria";
const aboutContent = "Hello. I am a student of Government college of engineering and technology Jammu (J&K). I'm studying E&C engineering . I am a full stack web developer . I also know C++ and i like to play guitar . I've always wanted to do something in programming . This is one of my first projects as a developer.";
const contactContent = "Contact For inquires : arnavk1802@gmail.com , arnavk1872@gmail.com ; twitter:Arnavkhajuria18";

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
