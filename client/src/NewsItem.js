import React from "react";
function NewsItem(props) {
  return (
    <div className="NewsItem">
      <p className="NewsItem-sideHeader">
        Article {props.id} published at: {props.publishedAt}
      </p>
      <h2 className="NewsItem-title">{props.title}</h2>
      <p>{props.description}</p>
      <button
        onClick={() => {
          props.removeArticle(props.id);
        }}
      >
        Dissmiss
      </button>
      <button
        onClick={() => {
          props.addFavorite(props.id);
        }}
      >
        Favourite
      </button>
    </div>
  );
}

export default NewsItem;
