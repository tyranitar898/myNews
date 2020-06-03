import React, { Component } from "react";

import NewsItem from "./NewsItem";
import "./App.css";
import fetch from "node-fetch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { articles: [], clientFetchFreq: 5000 };
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

  componentDidMount() {
    //Fetch on mount
    this.callBackendApi()
      .then((data) => {
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
  }

  render() {
    const newsList = this.state.articles.map((article, index) => (
      // Key should be specified inside the array.
      <NewsItem
        key={article.title + index}
        title={article.title}
        description={article.description}
        publishedAt={article.publishedAt}
      />
    ));

    return (
      <div className="App">
        <div id="AppHead">
          <h1>My News App</h1>
          <form method="POST" action="/clearArticles">
            <button>Clear articles</button>
          </form>
          <p>Current fetch frequency: {this.state.clientFetchFreq}</p>
          <form method="POST" action="/set-frequency">
            <input
              type="text"
              placeholder="Enter frequency for news update"
              name="freq"
              onChange={this.handleChange}
            />
            <button type="submit">ENTER</button>
          </form>
        </div>
        {newsList}
      </div>
    );
  }
}

export default App;
