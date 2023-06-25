import React, { useState, useEffect } from 'react';
import Square from './Square';
import Timer from './Timer.js';
import './Board.css';
import './Square.css'

var selectedSquareID = null
var squares = []
var revealing = false
var difficulty = 0.5
var squaresRevealed = 0

export default function Board() {
    function generateSudokuBoard() {
        let board = Array.from({length: 9}, () => Array(9).fill(0));
        
        // Filling diagonal boxes
        for (let i = 0; i < 9; i += 3) {
            fillBox(board, i, i);
        }
        
        // Filling remaining cells
        fillRemaining(board, 0, 3);
        
        // Mapping to required format
        return board.flatMap((row, i) =>
            row.map((value, j) => ({
            id: i * 9 + j,
            value: value
            }))
        );
    }
      
    function fillBox(board, row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
            do {
                num = Math.ceil(Math.random() * 9);
            } while (!isSafe(board, row, col, num));
        
            board[row + i][col + j] = num;
            }
        }
    }
      
    function fillRemaining(board, i, j) {
        if (j >= 9 && i < 8) {
            i = i + 1;
            j = 0;
        }
        if (i >= 9 && j >= 9) {
            return true;
        }
        if (i < 3) {
            if (j < 3) {
            j = 3;
            }
        } else if (i < 6) {
            if (j === (parseInt(i / 3)) * 3) {
            j = j + 3;
            }
        } else {
            if (j === 6) {
            i = i + 1;
            j = 0;
            if (i >= 9) {
                return true;
            }
            }
        }
        
        for (let num = 1; num <= 9; num++) {
            if (isSafe(board, i, j, num)) {
            board[i][j] = num;
            if (fillRemaining(board, i, j + 1)) {
                return true;
            }
        
            board[i][j] = 0;
            }
        }
        return false;
    }
    
    function isSafe(board, row, col, num) {
        // Check if 'num' is not already placed in current row, 
        // current column and current 3x3 box
        let startRow = row - row % 3,
            startCol = col - col % 3;
        
        for (let x = 0; x <= 8; x++) {
            if (board[row][x] === num) {
            return false;
            }
            if (board[x][col] === num) {
            return false;
            }
            if (board[startRow + Math.floor(x / 3)][startCol + x % 3] === num) {
            return false;
            }
        }
        return true;
    }

    const [sudokuBoard, setSudokuBoard] = useState(() => generateSudokuBoard());
    const [selectedSquareID, setSelectedSquareID] = useState(null);

    function undoHighlight(board){
        for (let i=0; i<board.length; i++){
            board[i]["weakHighlight"] = false
            board[i]["strongHighlight"] = false
        }
    }

    function highlightRow(board, id) {
        for (let i=0; i<board.length; i++){
            if (id !== null){
                if (Math.floor(i/9) === Math.floor(id/9)){
                    board[i]["weakHighlight"] = true
                }
            }
        }
    }
    
    function highlightCol(board, id) {
        for (let i=0; i<board.length; i++){
            if (id !== null){
                if (i % 9 === id % 9){
                    board[i]["weakHighlight"] = true
                }
            }
        }
    }
    
    function highlightSection(board, id) {
        var sections = [[0,1,2,9,10,11,18,19,20],
                        [3,4,5,12,13,14,21,22,23],
                        [6,7,8,15,16,17,24,25,26],
                        [27,28,29,36,37,38,45,46,47],
                        [30,31,32,39,40,41,48,49,50],
                        [33,34,35,42,43,44,51,52,53],
                        [54,55,56,63,64,65,72,73,74],
                        [57,58,59,66,67,68,75,76,77],
                        [60,61,62,69,70,71,78,79,80]]
    
        for (let j=0; j<sections.length; j++){
            if (sections[j].includes(id)){
                for (let i=0; i<sections[j].length; i++){
                    board[sections[j][i]]["weakHighlight"] = true
                }
            }
        }
    }
    
    function strongHighlightSameNumbers(board, id) {
        for (let i=0; i<board.length; i++){
            if (id !== null){
                if (board[i]["displayNum"] == board[id]["displayNum"] && board[i]["displayNum"] != "‎"){
                    board[i]["strongHighlight"] = true
                }
            }
        }
    }
    

    const selectSquareByID = (identifier) => {
        let tempBoard = [...sudokuBoard];
        if (revealing == false){
            if (selectedSquareID !== identifier) {
                if (selectedSquareID !== null) {
                    tempBoard[selectedSquareID]["selected"] = false;
                    undoHighlight(tempBoard, identifier);
                }
                tempBoard[identifier]["selected"] = true;
                undoHighlight(tempBoard, identifier);
                highlightRow(tempBoard, identifier);
                highlightCol(tempBoard, identifier);
                highlightSection(tempBoard, identifier);
                strongHighlightSameNumbers(tempBoard, identifier);
                setSelectedSquareID(identifier);
            } else {
                tempBoard[selectedSquareID]["selected"] = false;
                setSelectedSquareID(null)
                undoHighlight(tempBoard, identifier);
            }
        }
        else{
            if (tempBoard[identifier]["input"]){
                tempBoard[identifier]["displayNum"] = tempBoard[identifier]["value"]
                tempBoard[identifier]["input"] = false
                squaresRevealed = squaresRevealed + 1
                checkCompletion();
            }
        }
        setSudokuBoard(tempBoard);
    };

    const selectSquareByIDWithoutChecking = (identifier) => {
        let tempBoard = [...sudokuBoard];
        tempBoard[identifier]["selected"] = true;
        undoHighlight(tempBoard, identifier);
        highlightRow(tempBoard, identifier);
        highlightCol(tempBoard, identifier);
        highlightSection(tempBoard, identifier);
        strongHighlightSameNumbers(tempBoard, identifier);
        setSudokuBoard(tempBoard);
        setSelectedSquareID(identifier);
    };
    
    
    useEffect(() => {
        let updatedBoard = setupBoard(sudokuBoard);
        setSudokuBoard(updatedBoard);
    }, []);
      
      useEffect(() => {
        function setUpSquares(sudokuBoard) {
          let squaresArray = sudokuBoard.map((val) => {
            return (<Square
              trueNumber={val["value"]}
              displayNumber={val["displayNum"]}
              identifier={val["id"]}
              selectSquareByID={selectSquareByID}
              selected={val["selected"]}
              input={val["input"]}
              key={val["id"]}
              weakHighlight={val["weakHighlight"]}
              strongHighlight={val["strongHighlight"]}/>)})
          setSquares(squaresArray);
        }
        setUpSquares(sudokuBoard);
        checkCompletion();
      }, [sudokuBoard]);
      

    const [squaresSet, setSquares] = useState(squares);

    function moveRight() {
        if (selectedSquareID % 9 != 8) {
            selectSquareByID(selectedSquareID + 1)
        }
        else {
            selectSquareByID(selectedSquareID - 8)
        }
    }

    function moveLeft() {
        if (selectedSquareID % 9 != 0) {
            selectSquareByID(selectedSquareID - 1)
        }
        else {
            selectSquareByID(selectedSquareID + 8)
        }
    }

    function moveUp() {
        if (selectedSquareID > 8) {
            selectSquareByID(selectedSquareID - 9)
        }
        else {
            selectSquareByID(selectedSquareID + 72)
        }
    }

    function moveDown() {
        if (selectedSquareID > 72) {
            selectSquareByID(selectedSquareID - 72)
        }
        else {
            selectSquareByID(selectedSquareID + 9)
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            let updatedBoard = [...sudokuBoard];
            const key = event.key;
            if (selectedSquareID !== null) {
                if (updatedBoard[selectedSquareID]["input"] === true) {
                    if (key >= '1' && key <= '9') {
                        // Handle the key press for numbers 1 to 9
                        updatedBoard[selectedSquareID]["displayNum"] = parseInt(key)
                        checkCompletion();
                    } else if (key === 'Backspace') {
                        // Handle the Backspace key press
                        updatedBoard[selectedSquareID]["displayNum"] = "‎"
                    }
                    selectSquareByIDWithoutChecking(selectedSquareID);
                }
                if (key === 'ArrowRight'){
                    moveRight();
                }
                else if (key === 'ArrowLeft'){
                    moveLeft();
                }
                else if (key === 'ArrowUp'){
                    moveUp();
                }
                else if (key === 'ArrowDown'){
                    moveDown();
                }
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      },[sudokuBoard, selectedSquareID]);

      
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [isPuzzleFinished, setIsPuzzleFinished] = useState(false);

    function checkCompletion(){
        if (checkIfCompleted(sudokuBoard)){
            setIsPuzzleFinished(true);
            var y = document.getElementById("timerDiv");
            if (y) y.style.display = "none";
            var z = document.getElementById("newGameButton");
            if (z) z.style.display = "none";
            var c = document.getElementById("revealSquareButton");
            if (c) c.style.display = "none";
        };
    }

    function checkIfCompleted(board) {
        // Convert the 1D board to a 2D board
        const twoDBoard = Array.from({ length: 9 }, (_, i) => 
            board.slice(i * 9, i * 9 + 9).map(square => square.displayNum)
        );
    
        // Check each row
        for (let row of twoDBoard) {
            const numSet = new Set(row);
            if (numSet.size !== 9 || numSet.has("‎")) return false;
        }
    
        // Check each column
        for (let j = 0; j < 9; j++) {
            const numSet = new Set(twoDBoard.map(row => row[j]));
            if (numSet.size !== 9 || numSet.has("‎")) return false;
        }
    
        // Check each 3x3 box
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const numSet = new Set();
                for (let i = boxRow * 3; i < boxRow * 3 + 3; i++) {
                    for (let j = boxCol * 3; j < boxCol * 3 + 3; j++) {
                        numSet.add(twoDBoard[i][j]);
                    }
                }
                if (numSet.size !== 9 || numSet.has("‎")) return false;
            }
        }
    
        // If all rows, columns, and 3x3 boxes pass, it's a complete board
        return true;
    }
    

    function setupBoard(board) {
        let updatedBoard = [...board];
        for (let i=0; i<updatedBoard.length; i++) {
          if (Math.random() < difficulty) {
            updatedBoard[i]["displayNum"] = updatedBoard[i]["value"]
            updatedBoard[i]["input"] = false
          }
          else {
            updatedBoard[i]["displayNum"] = "‎"
            updatedBoard[i]["input"] = true
          }
          updatedBoard[i]["selected"] = false
          updatedBoard[i]["weakHighlight"] = false
          updatedBoard[i]["strongHighlight"] = false
        }
        return updatedBoard;
    }
    
    function playAnother() {
        var x = document.getElementById("newGameDiv");
        if (x) x.style.display = "none";
        var y = document.getElementById("timerDiv");
        if (y) y.style.display = "block";
        var z = document.getElementById("newGameButton");
        if (z) z.style.display = "block";
        var c = document.getElementById("revealSquareButton");
        if (c) c.style.display = "block";
        var c = document.getElementById("restartButton");
        if (c) c.style.display = "block";
        var y = document.getElementById("myRange");
        difficulty = 0.75 - y.value/100;
        if (revealing){
            enterRevealSquareMode();
        }
        squaresRevealed = 0;
        setSeconds(0);
        setMinutes(0);
        setIsPuzzleFinished(false);
        setSelectedSquareID(null);
        var temp = generateSudokuBoard()
        temp = setupBoard(temp);
        setSudokuBoard(temp);
    }

    function enterRevealSquareMode() {
        if (selectedSquareID !== null) {
          selectSquareByID(selectedSquareID);
        }
        revealing ^= true;
        let squares = document.querySelectorAll(".squareClass");
        for (let i = 0; i < squares.length; i++) {
          if (revealing) {
            squares[i].style.cursor = "help";
          } else {
            squares[i].style.cursor = "default";
          }
        }
        if (revealing){
            var x = document.getElementById("revealSquareButton");
            x.style.backgroundColor = "#be6666";
        }
        else {
            var x = document.getElementById("revealSquareButton");
            x.style.backgroundColor = "#be666650";
        }
      }
      

      function displayStartNewGame(){
        var x = document.getElementById("newGameDiv");
        if (x) x.style.display = "block";
        var y = document.getElementById("timerDiv");
        if (y) y.style.display = "none";
        var z = document.getElementById("newGameButton");
        if (z) z.style.display = "none";
        var c = document.getElementById("revealSquareButton");
        if (c) c.style.display = "none";
        var c = document.getElementById("restartButton");
        if (c) c.style.display = "none";
    }

    function restartBoard(board){
        let updatedBoard = [...board];
        for (let i=0; i<updatedBoard.length; i++){
            if (updatedBoard[i]['input']){
                updatedBoard[i]['displayNum'] = "‎"
            }
        }
        if (selectedSquareID !== null){
            selectSquareByID(selectedSquareID)
        }
        return updatedBoard;
    }

    return (
        <div>
        <div id='pageDiv'>
            <div id='timerDiv'>
                <Timer seconds={seconds} setSeconds={setSeconds} minutes={minutes} setMinutes={setMinutes} isPuzzleFinished={isPuzzleFinished}/>
            </div>
            <div id='newGameDiv'>
                <p id='newGameHeading'>Select your desired difficulty</p>
                <p id='easyText'>Easy</p> <p id='hardText'>Hard</p>
                <div className="slidecontainer">
                    <input type="range" min="0" max="50" defaultValue="25" className="slider" id="myRange"></input>
                </div>
                <button id='startGameButton' onClick={playAnother}>Start Game</button>
            </div>
            {isPuzzleFinished ? (
                <div className='finishBox'>
                Congratulations, you finished the puzzle!
                <h5>Your time taken was: {minutes} minutes and {seconds} seconds</h5>
                <h5>You used {squaresRevealed} reveals</h5>
                <button id='playAnotherButton' onClick={displayStartNewGame}>Play Another</button>
                </div>
            ) : (
            <>
            <div className='boardClass'>
                <div className='line' id='lineOne'/>
                <div className='line' id='lineTwo'/>
                <div className='line' id='lineThree'/>
                <div className='line' id='lineFour'/>
                {squaresSet}
            </div>
            </>
            )}
            <button id='newGameButton' className='controlButton' onClick={displayStartNewGame}>New Game</button>
            <button id='revealSquareButton' className='controlButton' onClick={enterRevealSquareMode}>Reveal Square</button>
            <button id='restartButton' className='controlButton' onClick={() => setSudokuBoard(restartBoard(sudokuBoard))}>Restart</button>
            </div>
    </div>
    );
}
