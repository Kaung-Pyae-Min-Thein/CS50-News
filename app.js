
const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//------------mongoDB

mongoose.connect("mongodb+srv://kaungpyae:kaungpyae@cluster0.zgab3.mongodb.net/cs50newsDB?retryWrites=true&w=majority");

const newsSchema = mongoose.Schema({
  title: String,
  content: String,
  author: String
});

const newsModel = mongoose.model('new', newsSchema);

// ----------router
app.route('/')
  .get((request, response) => {
    newsModel.find({}, (err, allnews) => {
      if (err) {
        response.render("err", { error: err });
      }
      else {
        // console.log(allnews);
        response.render("home", { news: allnews });
      }
    });
  });

app.route('/compose')
  .get((request, response) => {
    response.render('compose');
  })

  .post((request, response) => {

    const updateNews = new newsModel({
      title: request.body.title,
      content: request.body.content,
      author: request.body.author
    });

    updateNews.save()
      .then(() => response.redirect("/"))
      .catch((err) => response.render("err", { error: err }));
  });

app.route("/post/:newsID")
  .get((request, response) => {
    newsModel.findById(request.params.newsID, (err, foundNews) => {
      if (err) {
        response.render("err", { error: err });
      } else {
        response.render('post', { oneNews: foundNews });
      }
    });
  });

app.route("/author/:authorName")
  .get((request, response) => {
    newsModel.find({ author: request.params.authorName }, (err, authorNews) => {
      if (err) {
        response.render("err", { error, err });
      }
      else {
        response.render('home', { news: authorNews });
      }
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server set up at ${port}`));