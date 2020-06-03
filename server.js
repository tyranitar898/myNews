const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
//set up express app
const app = express();

let Data = { articles: [], fetchFrequency: 5000 };

let counter = 0;
function formatData(articleArr) {
  for (article of articleArr) {
    article.publishedAt = new Date(article.publishedAt);
  }
  return articleArr;
}
//3 event api http://www.mocky.io/v2/5ed6e3e532000078002743e9
//1 event api http://www.mocky.io/v2/5ed6dc5832000035002743cc

let timerID = setTimeout(function request() {
  fetch("http://www.mocky.io/v2/5ed6e3e532000078002743e9")
    .then((res) => res.json()) //res.json returns a promise like fetch
    .then((json) => {
      counter += 1;
      console.log(counter);

      formattedArticles = formatData(json.articles);
      Data.articles = Data.articles.concat(formattedArticles);
      Data.articles.sort((b, a) => b.publishedAt - a.publishedAt);

      //console.log(Data.articles);
    })
    .catch((err) => console.log(err));
  timerID = setTimeout(request, Data.fetchFrequency);
}, Data.fetchFrequency);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO: modularize routing

// Serve any static files
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.get("/express_backend", function (req, res) {
  res.json(Data);
});

let freq = 0;
app.post("/set-frequency", (req, res) => {
  freq = req.body.freq;
  console.log("recieved post");
  //better check for proper freq
  if (freq !== 0 && freq < 10000) {
    Data.fetchFrequency = freq;
    res.redirect("/");
  } else {
    res.redirect("/error");
    //create error page
  }
});

app.post("/clearArticles", (req, res) => {
  console.log("recied post form clear articles");
  Data.articles = [];
  res.redirect("/");
});

/*
fetch(
  "http://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "apiKey=3106bc28b3154bc9b2eafdfc1d4a935c"
);*/

//listen for requests
app.listen(process.env.PORT || 4000, () => {
  console.log("now lisenting on port 4000");
});
