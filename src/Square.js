import React, { useState, useEffect } from 'react'
import './Square.css'

export default function Square({ displayNumber, trueNumber, identifier, selectSquareByID, selected, input, strongHighlight, weakHighlight }) {
  var boxShadowStyle = 'none';

  if (selected) {
    boxShadowStyle = 'inset 0 0 0 2px #c4b303'
  }
  else if (strongHighlight){
    boxShadowStyle = 'inset 0 0 0 2px #a33939'
  }

  const handleClickWithID = () => {
    selectSquareByID(identifier);
  };

  var filter = "brightness(110%)"
  if (weakHighlight === true) {
    filter = "brightness(140%)"
  }

  if (!input) {
    return (
      <div className="squareClass nonInputClass" onClick={handleClickWithID} style={{ boxShadow: boxShadowStyle, filter: filter }}>
        <h1 className="displayNumberClass">{displayNumber}</h1>
      </div>
    );
  } else {
    return (
      <div className="squareClass inputClass" onClick={handleClickWithID} style={{ boxShadow: boxShadowStyle, filter: filter }}>
        <h1 className="displayNumberClass">{displayNumber}</h1>
      </div>
    );
  }
}

