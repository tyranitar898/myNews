import React, { Component } from "react";
import NewsItem from "./NewsItem";
//import favArticle from "./favArticle";
import "./App.css";
import fetch from "node-fetch";

let FIVEMS = 5000;
let ONEMS = 1000;
let ONEDAY = 1000 * 60 * 60 * 24;
let ONEHOUR = 1000 * 60 * 60;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { articles: [], clientFetchFreq: "5000", faveArticles: [] };
  }

  callBackendApi = async () => {
    let data;
    try {
      let res = await fetch("/express_backend");
      data = await res.json();
    } catch (err) {
      console.log(err);
    }
    return data;
  };

  addFaveArticle = (index) => {
    let temp = this.state.faveArticles;
    if (temp.indexOf(index) === -1) {
      temp.push(index);
      this.setState({ faveArticles: temp });
    }
  };

  componentDidMount() {
    //Fetch on mount
    this.callBackendApi()
      .then((data) => {
        console.log(data);
        this.setState(
          {
            articles: data.articles,
            clientFetchFreq: data.fetchFrequency,
          },
          () => {
            //Interval fetch (happens on the callback of the first fetch)
            this.timer = setInterval(() => {
              this.callBackendApi().then((data) => {
                this.setState({
                  articles: data.articles,
                  clientFetchFreq: data.fetchFrequency,
                });
                console.log(data);
              });
            }, this.state.clientFetchFreq);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const newsList = this.state.articles.map((article, index) => (
      // Key should be specified inside the array due to how ract manages and identifies components
      <NewsItem
        index={index}
        key={article.title + index}
        title={article.title}
        description={article.description}
        publishedAt={article.publishedAt}
        addFavorite={this.addFaveArticle}
      />
    ));

    return (
      <div className="App">
        <div id="AppHead">
          <h1>My News App</h1>
          <form method="POST" action="/clearArticles">
            <button>Clear articles</button>
          </form>
          <p>My favourite articles:</p>
          <ul>
            {this.state.faveArticles.map((index) => (
              <li key={index}>Article #{index}</li>
            ))}
          </ul>
          <p>
            Current fetch frequency:&nbsp;
            {parseMsToTimeString(this.state.clientFetchFreq)}
          </p>
          <form method="POST" action="/set-frequency">
            <select name="freq">
              <option name="freq" value={FIVEMS}>
                5 ms
              </option>
              <option name="freq" value={ONEMS}>
                1 ms
              </option>
              <option name="freq" value={ONEHOUR}>
                1 hr
              </option>
              <option name="freq" value={ONEDAY}>
                1 day
              </option>
            </select>
            <button type="submit">ENTER</button>
          </form>
        </div>
        {newsList}
      </div>
    );
  }
}

function parseMsToTimeString(ms) {
  if (ms === "5000") {
    return "5 ms";
  } else if (ms === "1000") {
    return "1 ms";
  } else if (ms === "3600000") {
    return "1 Hour";
  } else if (ms === "86400000") {
    return "1 Day";
  }
}

export default App;

/*
<form method="POST" action="/set-frequency">
            <input
              type="text"
              placeholder="Enter frequency for news update"
              name="freq"
              onChange={this.handleChange}
            />
            <button type="submit">ENTER</button>
          </form>
*/

/*
    fetch("/express_backend")
      .then((res) => res.json())
      .then((data) => {
        //TODO: after we get the articles need to organize them by date.
        this.setState(
          {
            articles: data.articles,
            clientFetchFreq: data.fetchFrequency,
          },
          () => {
            //interval fetch .. shoud i be using await
            this.timer = setInterval(() => {
              fetch("/express_backend")
                .then((res) => res.json())
                .then((data) => {
                  //TODO: after we get the articles need to organize them by date.
                  this.setState({
                    articles: data.articles,
                    clientFetchFreq: data.fetchFrequency,
                  });
                  console.log(data);
                })
                .catch((err) => console.log(err));
            }, this.state.clientFetchFreq);
          }
        );
      })
      .catch((err) => console.log(err));*/
