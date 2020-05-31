const express = require("express");

//set up express app
const app = express();

//listen for requests
app.listen(process.env.port || 4000, () => {
  console.log("now lisenting on port 4000");
});

app.get("/express_backend", function (req, res) {
  res.send({ express: "YOUR BACKEND IS CONNECTED TO REACT" });
});
