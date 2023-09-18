import {useState} from "react";

const Square = ({value, onSquareClick, styleBgr}) => {
    return (
        <button
            className="square"
            onClick={onSquareClick}
            style={styleBgr}
        >
            {value}
        </button>
    );
}

const Board = ({xIsNext, squares, onPlay, history, currentMove}) => {
    const winner = calculateWinner(squares) ? squares[calculateWinner(squares)[0]] : calculateWinner(squares)
    let status
    if (winner) {
        status = 'Winner: ' + winner
    } else if (history.length === 10 && currentMove === 9) {
        status = 'Draw!'
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O')
    }

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        let nextSquares = [...squares]
        xIsNext ? (nextSquares[i] = 'X') : nextSquares[i] = 'O'
        const row = Math.floor(i / 3) + 1
        const col = (i % 3) + 1
        onPlay(nextSquares, row, col)
    }

    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
                return lines[i]
            }
        }
        return null
    }

    const boardRows = []
    for (let i = 0; i < 3; i++) {
        const squaresInRow = []
        for (let j = 0; j < 3; j++) {
            const squareIndex = i * 3 + j
            squaresInRow.push(
                <Square
                    key={squareIndex}
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                    styleBgr={{
                        background: (calculateWinner(squares) && calculateWinner(squares).includes(squareIndex)) ? 'green' : '#fff'
                    }}
                />
            )
        }
        boardRows.push(
            <div key={i} className="board-row">
                {squaresInRow}
            </div>
        )
    }

    return (
        <>
            <div className="status">{status}</div>
            <div>{boardRows}</div>
        </>
    );
}

const Game = () => {
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)
    const [isReversed, setIsReversed] = useState(false)
    const xIsNext = currentMove % 2 === 0
    const currentSquares = history[currentMove]

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    const jumpTo = (nextMove) => {
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) => {
        let description
        if (move === 0) {
            description = 'Go to game start'
        } else if (move === currentMove) {
            description = 'You are at move #' + move;
        } else {
            description = 'Go to move #' + move;
        }
        return (
            <li key={move}>
                <button onClick={() => {jumpTo(move)}}>{description}</button>
            </li>
        )
    })
    const reversedMoves = moves.slice().reverse()

    const handleSwitch = () => {
        setIsReversed(!isReversed)
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} history={history} currentMove={currentMove}/>
            </div>
            <div className="game-info">
                <button onClick={handleSwitch}>Switch</button>
                {isReversed ? <ol>{reversedMoves}</ol> : <ol>{moves}</ol>}
            </div>
        </div>
    );
}

export default Game