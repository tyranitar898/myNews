import React from "react";
function NewsItem(props) {
  return (
    <div className="NewsItem">
      <p className="NewsItem-sideHeader">
        Article {props.index} published at: {props.publishedAt}
      </p>
      <h2 className="NewsItem-title">{props.title}</h2>
      <p>{props.description}</p>
      <button>X</button>
      <button
        onClick={() => {
          props.addFavorite(props.index);
        }}
      >
        Star
      </button>
    </div>
  );
}

export default NewsItem;
