import React, { useState, useEffect } from 'react'
import './Square.css'

export default function Square({ displayNumber, trueNumber, identifier, selectSquareByID, selected, input }) {
  const boxShadowStyle = selected ? 'inset 0 0 0 2px #c4b303' : 'none';

  const handleClickWithID = () => {
    selectSquareByID(identifier);
  };

  if (!input) {
    return (
      <div className="squareClass nonInputClass" onClick={handleClickWithID} style={{ boxShadow: boxShadowStyle }}>
        <h1 className="displayNumberClass">{displayNumber}</h1>
      </div>
    );
  } else {
    return (
      <div className="squareClass inputClass" onClick={handleClickWithID} style={{ boxShadow: boxShadowStyle }}>
        <h1 className="displayNumberClass">{displayNumber}</h1>
      </div>
    );
  }
}

