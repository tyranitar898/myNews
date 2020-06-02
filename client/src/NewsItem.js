import React from "react";
function NewsItem(props) {
  //const players = props.game.players;

  return (
    <div className="NewsItem">
      <h2>{props.title}</h2>
      <h3>{props.publishedAt}</h3>
      <p>{props.description}</p>
    </div>
  );
}

export default NewsItem;
