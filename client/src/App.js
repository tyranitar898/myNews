import React, { Component } from "react";
import logo from "./logo.svg";
import NewsItem from "./NewsItem";
import "./App.css";
import fetch from "node-fetch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { articles: [], clientFetchFreq: 5000 };
  }

  componentDidMount() {
    //fetch first time
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

    //timer fetch
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
  /*
  handleChange = (event) => {
    this.setState({ clientFetchFreq: event.target.value });
  };*/

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
        <h1>My News App</h1>
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
        {newsList}
      </div>
    );
  }
}

export default App;
