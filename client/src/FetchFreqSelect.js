import React from "react";
function FetchFreqSelect(props) {
  let FIVEMS = 5000;
  let ONEMS = 1000;
  let ONEDAY = 1000 * 60 * 60 * 24;
  let ONEHOUR = 1000 * 60 * 60;

  return (
    <div>
      <form method="POST" action="/set-frequency">
        <select name="freq">
          <option name="freq" value={FIVEMS}>
            5 ms
          </option>
          <option name="freq" value={ONEMS}>
            1 ms
          </option>
          <option name="freq" value={ONEHOUR}>
            1 hr
          </option>
          <option name="freq" value={ONEDAY}>
            1 day
          </option>
        </select>
        <button type="submit">ENTER</button>
      </form>
    </div>
  );
}

export default FetchFreqSelect;
