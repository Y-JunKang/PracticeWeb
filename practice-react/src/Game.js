import React, { Component } from 'react';
import './Game.css'

function Square(props) {
    return (
        <button className="square" onClick={props.handleClick}>
            {props.value}
        </button>
    );
}

class Board extends Component {
    render() {
        let width = this.props.width;
        let board = Array(width).fill().map((n, i) => {
            let boardRow = Array(width).fill().map((n, j) => {
                return (
                    <Square value={this.props.squares[i][j]} handleClick={() => this.props.handleClick(j, i)} key={width * i + j} />
                )
            })
            return (
                <div className="board-row" key={i}>
                    {boardRow}
                </div>
            )
        })

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(3).fill(Array(3).fill(null)),
                    nextPlayer: 'X',
                    dropAt: null
                }
            ],
            stepNum: 0
        };
    }

    handleClick(x, y) {
        let currentStep = this.state.history[this.state.stepNum];
        if (calcWinner(currentStep.squares, currentStep.dropAt, 3) || currentStep.squares[y][x]) {
            return;
        }

        let nextStep = {};
        nextStep.squares = deepcopy(currentStep.squares);
        nextStep.squares[y][x] = currentStep.nextPlayer;
        nextStep.nextPlayer = currentStep.nextPlayer === 'X' ? 'O' : 'X';
        nextStep.dropAt = [x, y];

        let stepNum = this.state.stepNum + 1;
        let history = this.state.history.slice(0, stepNum);
        history.push(nextStep);
        this.setState({
            history: history,
            stepNum: stepNum
        })
    }

    renderHistory(history) {
        const historyItems = history.map((step, index) => {
            let desc = `${step.nextPlayer === 'X' ? 'O' : 'X'} drop at ${step.dropAt}`;
            if (index === 0) {
                desc = `goto start`
            }
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{desc}</button>
                </li>
            )
        })

        return historyItems;
    }

    jumpTo(index) {
        this.setState({
            stepNum: index
        })
    }

    render() {
        const step = this.state.history[this.state.stepNum];
        const squares = step.squares;
        let status = 'next player :' + step.nextPlayer;
        const winner = calcWinner(squares, step.dropAt, 3);
        if (winner) {
            status = 'winner is ' + winner
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} handleClick={(x, y) => this.handleClick(x, y)} width={3} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.renderHistory(this.state.history)}</ol>
                </div>
            </div>
        );
    }
}

function calcWinner(squares, dropAt, condition) {

    if (!dropAt) {
        return null;
    }
    let [x, y] = dropAt;
    if (x >= squares[0].length || y >= squares.length) {
        throw Error(`calcWiner dropAt ${dropAt} squares size (${squares[0].length},${squares.length}) outside`);
    }
    let player = squares[y][x];
    let borderXMin = (x - condition + 1) >= 0 ? (x - condition + 1) : 0;
    let borderXMax = (x + condition - 1) <= squares[0].length - 1 ? (x + condition - 1) : squares[0].length - 1;
    let borderYMin = (y - condition + 1) >= 0 ? (y - condition + 1) : 0;
    let borderYMax = (y + condition - 1) <= squares.length - 1 ? (y + condition - 1) : squares.length - 1;

    let result = checkLine([x, borderYMin], [x, borderYMax], condition, squares, player);
    if (!result) result = checkLine([borderXMin, y], [borderXMax, y], condition, squares, player);
    if (!result) result = checkLine([borderXMin, borderYMin], [borderXMax, borderYMax], condition, squares, player);
    if (!result) result = checkLine([borderXMin, borderYMax], [borderXMax, borderYMin], condition, squares, player);

    return result;
}

function checkLine(startPoint, endPoint, condition, squares, player) {
    let count = 0;
    let stepX = step4Line(startPoint[0], endPoint[0]);
    let stepY = step4Line(startPoint[1], endPoint[1]);
    let [x, y] = startPoint;
    let [endX, endY] = endPoint
    for (; (x !== endX + stepX) || (y !== endY + stepY); x += stepX, y += stepY) {
        if (squares[y][x] === player) {
            count++;
            if (count === condition) return player;
        } else {
            count = 0;
        }
    }
    return null;
}

function step4Line(start, end) {
    let step = 0;
    if (start > end) {
        step = -1;
    } else if (start < end) {
        step = 1;
    }
    return step;
}

function deepcopy(obj) {
    var out = [], i = 0, len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = deepcopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
}
// ========================================

export default Game;
