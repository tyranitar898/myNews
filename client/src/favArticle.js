import React from "react";
function favArticles(props) {
  return (
    <ol>
      {props.favArticles.map((index) => (
        <li key={index}>{index}</li>
      ))}
    </ol>
  );
}

export default favArticles;
