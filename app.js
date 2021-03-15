const express = require("express");

const bodyparser = require("body-parser");

const app = express();

const mongoose = require("mongoose");

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser: true,useUnifiedTopology: true});

const wikischema = new mongoose.Schema(
  {
    title: String,
    content: String
  }
);

const Article = mongoose.model("Article",wikischema);

const item1 = new Article({
  title: "REST",
  content: "Representational state transfer (REST) is a software architectural style which uses a subset of HTTP.[1] It is commonly used to create interactive applications that use Web services. A Web service that follows these guidelines is called RESTful. Such a Web service must provide its Web resources in a textual representation and allow them to be read and modified with a stateless protocol and a predefined set of operations. This approach allows interoperability between the computer systems on the Internet that provide these services. REST is an alternative to, for example, SOAP as way to access a Web service."
});

app.get("/articles",function(req,res){
  Article.find({},function(err,result){
    if(!err)
    res.send(result);
    else
    res.send(err);
  });
});

app.post("/articles",function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newarticle = new Article(
    {
      title: req.body.title,
      content: req.body.content
    }
  );

  newarticle.save();
});

app.delete("/articles",function(req,res){
  Article.delete({},function(err,result){
    if(!err)
    {
      console.log("Successfully deleted everything!!");
    }
    else{
      console.log("Cant delete");
    }
  })
});

app.route("/articles/:items")

.get(function(req,res){
  Article.findOne({title: req.params.items},function(err,result){
    if(result)
    {
      res.send(result);
    }
    else
    res.send("No articles found");
  });

})

.put(function(req,res){
  Article.update({title: req.params.items},{title: req.body.title, content: req.body.content},{overwrite: true},function(err){
    if(!err)
    res.send("Successfully done");
  });
})

.patch(function(req,res){
  Article.update({title: req.params.items},{$set: req.body},function(err){});
})

.delete(function(req,res){
  Article.deleteOne({title: req.params.items},function(err){
    if(!err)
    res.send("Successfully Deleted");
  });
});


app.listen(3000,function(request,response){
  console.log("Server running Successfully");
});
