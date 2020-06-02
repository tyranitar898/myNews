import React, { Component } from "react";
import logo from "./logo.svg";
import NewsItem from "./NewsItem";
import "./App.css";
import fetch from "node-fetch";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { articles: [] };
  }

  componentDidMount() {
    // Call our fetch function below once the component mounts
    //this.timer = setInterval(() => this.callBackendAPI(), 100);
    /*this.callBackendAPI()
      .then((res) => {
        this.setState({ articles: res.articles });
        console.log(res.articles);
      })
      .catch((err) => console.log(err));*/
    fetch("/express_backend")
      .then((res) => res.json())
      .then((articles) => {
        //TODO: after we get the articles need to organize them by date.
        this.setState({ articles: articles });
        console.log(articles);
      });
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  /*callBackendAPI = async () => {
    const response = await fetch("/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
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
        {newsList}
        <form method="POST" action="/set-frequency">
          <input
            type="text"
            placeholder="Enter frequency for news update"
            name="freq"
          />
          <button type="submit">ENTER</button>
        </form>
      </div>
    );
  }
}

export default App;
