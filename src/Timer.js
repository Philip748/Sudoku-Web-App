import React, { useEffect } from 'react';
import './Timer.css'

function Timer({ seconds, setSeconds, minutes, setMinutes, isPuzzleFinished }) {
  useEffect(() => {
    let timerId;
    
    if (!isPuzzleFinished) {
      if (seconds < 59) {
        timerId = setTimeout(() => {
          setSeconds(seconds + 1);
        }, 1000);
      } else {
        timerId = setTimeout(() => {
          setSeconds(0);
          setMinutes(minutes + 1);
        }, 1000);
      }
    }

    return () => clearTimeout(timerId);
  }, [seconds, minutes, isPuzzleFinished, setSeconds, setMinutes]);

  const paddedSeconds = String(seconds).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');

  return (
    <div id='clockDiv'>
      {paddedMinutes} : {paddedSeconds}
    </div>
  );
}

export default Timer;



