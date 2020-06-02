import React from "react";
function NewsItem(props) {
  //const players = props.game.players;

  return (
    <div className="NewsItem">
      <p className="NewsItem-sideHeader">{props.publishedAt}</p>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <button>X</button>
      <button>Star</button>
    </div>
  );
}

export default NewsItem;
