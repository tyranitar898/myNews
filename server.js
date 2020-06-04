const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();

let Data = { articles: [], fetchFrequency: "5000" };
//counter to keep track of timer updates
let counter = 0;
//timeHandler returned by the servers timeout() calls
let timeHandle = null;

startFetchTimer();

//middleware for parsing forms and storing result as json obj
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* <----- ROUTES ----- >*/
//Serve any static files
app.use(express.static(path.join(__dirname, "client/build")));
//Route home page to index.html
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "client/build", "index.html"));
});
//Route accessing backend
app.get("/express_backend", function (req, res) {
  res.json(Data);
});
//Route for post request to update pull frequency
app.post("/set-frequency", (req, res) => {
  let freq = 0;
  freq = req.body.freq;
  //Simple check to see that user inputed a number
  if (freq !== 0) {
    Data.fetchFrequency = freq;
    console.log(Data.fetchFrequency);
    startFetchTimer();
    res.redirect("/");
  } else {
    res.redirect("/error");
  }
});
//Route for clearing the articles in the data base
app.post("/clearArticles", (req, res) => {
  console.log("recied post form clear articles");
  Data.articles = [];
  res.redirect("/");
});

//Listen for requests
app.listen(process.env.PORT || 4000, () => {
  console.log("now lisenting on port 4000");
});
//with id http://www.mocky.io/v2/5ed92b8d31000090b6c4ebd1

//3 event api http://www.mocky.io/v2/5ed6e3e532000078002743e9
//1 event http://www.mocky.io/v2/5ed88e803100001000c4e528

/* startFetchTimer 
  1. checks if there's an exisiting timeoutHandle and terminates existing one
  2. creates a new timeout interval based on the newly user inputed fetch rate.
 */
function startFetchTimer() {
  if (timeHandle !== null) {
    clearTimeout(timeHandle);
  }
  timeHandle = setTimeout(function request() {
    fetch("http://www.mocky.io/v2/5ed9288331000053b2c4eba1")
      .then((res) => res.json()) //res.json returns a promise like fetch()
      .then((json) => {
        counter += 1;
        console.log(counter);

        //Format the recieved data -> add it to the exisiting articles -> sort it by date
        formattedArticles = formatData(json.articles);
        Data.articles = Data.articles.concat(formattedArticles);
        Data.articles.sort((b, a) => b.publishedAt - a.publishedAt);
      })
      .catch((err) => console.log(err));
    timeHandle = setTimeout(request, Data.fetchFrequency);
  }, Data.fetchFrequency);
}
//Formats the article array to use Date objects instead of strings for sorting.
function formatData(articleArr) {
  for (article of articleArr) {
    article.publishedAt = new Date(article.publishedAt);
  }
  return articleArr;
}

//API json object

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
