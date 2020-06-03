const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
//set up express app
const app = express();

let Data = { articles: [], fetchFrequency: 5000 };
let freq = 0;
let counter = 0;

function formatData(articleArr) {
  for (article of articleArr) {
    article.publishedAt = new Date(article.publishedAt);
  }
  return articleArr;
}
//3 event api http://www.mocky.io/v2/5ed6e3e532000078002743e9
//1 event

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
//route home page to index.html
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "client/build", "index.html"));
});
//routing for accessing backend
app.get("/express_backend", function (req, res) {
  res.json(Data);
});

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

//Listen for requests
app.listen(process.env.PORT || 4000, () => {
  console.log("now lisenting on port 4000");
});

/*
{
"articles":[ {
    "title": "Zoom revenue growth rockets in work-from-home age - CNBC",
    "author": "Jordan Novet",
    "description": "Zoom has been a darling of the work-from-home culture brought on by coronavirus, and the company's revenue growth accelerated in its most recent quarter.",
    "publishedAt": "2020-06-03T17:38:34Z"
    }, {
  "title": "Toyota estimates May U.S. auto sales were 'beyond expectations' but still down due to coronavirus - CNBC",
  "author": "Michael Wayland",
  "description": "Toyota Motor expects U.S. sales of new vehicles in May to be \"beyond expectations\" but still down compared with a year ago due to the coronavirus pandemic.",
  "publishedAt": "2020-06-05T12:01:44Z"
  }, {
  "title": "U.S. Protests Spark Reactions Around the World, From Citizens to Leaders",
  "author": "Esther Fung",
  "description": "Anti-racism protests sparked by the death of George Floyd in Minneapolis have spread across the world, from New Zealand to Brazil. Meanwhile, adversaries including China and Iran have criticized the U.S. government’s handling of the demonstrations.",
  "publishedAt": "2020-06-04T10:01:02Z"
  }]

}*/
