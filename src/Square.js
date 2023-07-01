import React, { useState, useEffect } from 'react'
import './Square.css'

export default function Square({ displayNumber, trueNumber, identifier, selectSquareByID, selected, input, strongHighlight, weakHighlight }) {
  var boxShadowStyle = 'none';
  var color = '#3b3b3b';

  let backgroundColor = ''  

  if (selected) {
    backgroundColor = '#56a2c3'
  }
  else if (strongHighlight){
    color = '#006fff';
  }

  const handleClickWithID = () => {
    selectSquareByID(identifier);
  };

  var filter = "brightness(100%)"
  if (weakHighlight === true) {
    filter = "brightness(120%)"
  }
  
  if (!input) {
    if(backgroundColor == ''){
      backgroundColor = '#85e0e4'
    }
    return (
      <div className="squareClass nonInputClass" onClick={handleClickWithID} style={{ color: color, boxShadow: boxShadowStyle, filter: filter, backgroundColor: backgroundColor}}>
        <h1 className="displayNumberClass">{displayNumber}</h1>
      </div>
    );
  } else {
    if(backgroundColor == ''){
      backgroundColor = '#d2f6ff'
    }
    return (
      <div className="squareClass inputClass" onClick={handleClickWithID} style={{ color: color, boxShadow: boxShadowStyle, filter: filter, backgroundColor: backgroundColor}}>
        <h1 className="displayNumberClass">{displayNumber}</h1>
      </div>
    );
  }
}

