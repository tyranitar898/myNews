const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
//set up express app
const app = express();

//listen for requests
app.listen(process.env.port || 4000, () => {
  console.log("now lisenting on port 4000");
});

let newsData = [];
/*
fetch(
  "http://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "apiKey=3106bc28b3154bc9b2eafdfc1d4a935c"
);*/
let counter = 0;
setInterval(() => {
  fetch("http://www.mocky.io/v2/5ed5e5e0340000370006d4ad")
    .then((res) => res.json()) //res.json returns a promise like fetch
    .then((json) => {
      counter += 1;
      console.log(counter);
      newsData = newsData.concat(json.articles);
      console.log(newsData);
    })
    .catch((err) => console.log(err));
}, 5000);

/*
fetch("http://www.mocky.io/v2/5ed596d2340000740006d364")
  .then((res) => res.json()) //res.json returns a promise like fetch
  .then((json) => {
    //console.log(json);
    newsData = json;
  })
  .catch((err) => console.log(err));
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/express_backend", function (req, res) {
  //res.send({ express: "YOUR BACKEND IS CONNECTED TO REACT" });

  res.json(newsData);
});

let freq = 0;
app.post("/set-frequency", (req, res) => {
  freq = req.body.freq;
  console.log("recieved post");
  if (freq !== 0 && freq < 1000) {
    res.redirect("/");
    console.log(freq);
  } else {
    res.redirect("/error");
  }
});

//TODO
//1. Watch CSResouces/webdev routes
//2. implement reddit veriosn of my news
//3. learna how to serve js using express
//4. lfie goals: podcast and famous movie cameo
