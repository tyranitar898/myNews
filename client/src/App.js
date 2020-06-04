import React, { Component } from "react";
import NewsItem from "./components/NewsItem";
import FavouriteNewsItem from "./components/FavouriteNewsItem";
import FetchFreqSelect from "./components/fetchFreqSelect";
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

  addFaveArticle = (id) => {
    let temp = this.state.faveArticles;
    if (temp.indexOf(id) === -1) {
      temp.push(id);
      this.setState({ faveArticles: temp });
    }
  };

  removeArticle = (id) => {
    let articleCopy = this.state.articles;
    for (var i = 0; i < articleCopy.length; i++) {
      if (articleCopy[i].id === id) {
        articleCopy.splice(i, 1);
        this.setState({ articles: articleCopy });
        return;
      }
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
      // Key should be specified inside the array due
      //to how ract manages and identifies components
      <NewsItem
        id={article.id}
        index={index}
        key={article.title + index}
        title={article.title}
        description={article.description}
        publishedAt={article.publishedAt}
        addFavorite={this.addFaveArticle}
        removeArticle={this.removeArticle}
      />
    ));

    const favouritesList = this.state.faveArticles.map((articleID, index) => (
      <FavouriteNewsItem value={articleID} key={index} />
    ));

    return (
      <div className="App">
        <div id="AppHead">
          <h1>My News App</h1>
          <p># of articles: {this.state.articles.length}</p>
          <form method="POST" action="/clearArticles">
            <button>Clear articles</button>
          </form>
          <div id="sidePanel">
            <p>My favourite articles:</p>
            <ul>{favouritesList}</ul>
          </div>
          <p>
            Current fetch frequency:&nbsp;
            {parseMsToTimeString(this.state.clientFetchFreq)}
          </p>
          <FetchFreqSelect />
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
