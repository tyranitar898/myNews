import React, { Component } from "react";

import NewsItem from "./NewsItem";
import "./App.css";
import fetch from "node-fetch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { articles: [], clientFetchFreq: 5000 };
  }
  //TODO: modularize fetch
  componentDidMount() {
    //fetch first time
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
            //interval fetch
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
      .catch((err) => console.log(err));
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

/*
  handleChange = (event) => {
    this.setState({ clientFetchFreq: event.target.value });
  };*/

export default App;
