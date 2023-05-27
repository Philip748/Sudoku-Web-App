import React, { useState, useEffect } from 'react'
import Square from './Square'
import './Board.css'

var selectedSquareID = null
var squares = []

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

    const sudokuBoard = generateSudokuBoard();

    const selectSquareByID = (identifier) => {
        if (selectedSquareID !== identifier) {
            if (selectedSquareID !== null) {
            sudokuBoard[selectedSquareID]["selected"] = false
            }
            selectedSquareID = identifier
            sudokuBoard[selectedSquareID]["selected"] = true
        }
        else {
            sudokuBoard[selectedSquareID]["selected"] = false
            selectedSquareID = null
        }
        setUpSquares(sudokuBoard);
        setSquares(squares)
      };
    
    for (let i=0; i<sudokuBoard.length; i++) {
        if (Math.random() < 0.5) {
            sudokuBoard[i]["displayNum"] = sudokuBoard[i]["value"]
            sudokuBoard[i]["input"] = false
        }
        else {
            sudokuBoard[i]["displayNum"] = "‎"
            sudokuBoard[i]["input"] = true
        }
        sudokuBoard[i]["selected"] = false
    }


    function setUpSquares(sudokuBoard) {
        squares = sudokuBoard.map((val) => {
            {return (<Square
                trueNumber={val["value"]}
                displayNumber={val["displayNum"]}
                identifier={val["id"]}
                selectSquareByID={selectSquareByID}
                selected={val["selected"]}
                input={val["input"]}
                key={val["id"]}/>)}})
    }
    setUpSquares(sudokuBoard);

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
            const key = event.key;
            if (selectedSquareID !== null) {
                if (sudokuBoard[selectedSquareID]["input"] === true) {
                    if (key >= '1' && key <= '9') {
                        // Handle the key press for numbers 1 to 9
                        sudokuBoard[selectedSquareID]["displayNum"] = parseInt(key)
                    } else if (key === 'Backspace') {
                        // Handle the Backspace key press
                        sudokuBoard[selectedSquareID]["displayNum"] = "‎"
                    }
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
                setUpSquares(sudokuBoard);
                setSquares(squares)
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    return (
        <>
            <div className='line' id='lineOne'/>
            <div className='line' id='lineTwo'/>
            <div className='line' id='lineThree'/>
            <div className='line' id='lineFour'/>
            <div className='boardClass'>
                {squaresSet}
            </div>
        </>
    )
}
