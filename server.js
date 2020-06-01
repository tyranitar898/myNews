const express = require("express");
const path = require("path");
//set up express app
const app = express();

//listen for requests
app.listen(process.env.port || 4000, () => {
  console.log("now lisenting on port 4000");
});

app.get("/express_backend", function (req, res) {
  res.send({ express: "YOUR BACKEND IS CONNECTED TO REACT" });
});

//TODO
//1. Watch CSResouces/webdev routes
//2. implement reddit veriosn of my news
//3. learna how to serve js using express
//4. lfie goals: podcast and famous movie cameo
