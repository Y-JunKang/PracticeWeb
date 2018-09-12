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
        this.winner = null;
        this.state = {
            history: [
                {
                    squares: Array(this.props.width).fill(Array(this.props.width).fill(null)),
                    nextPlayer: 'X',
                    dropAt: null
                }
            ],
            stepNum: 0
        };
    }

    handleClick(x, y) {
        let currentStep = this.state.history[this.state.stepNum];
        if (this.winner || currentStep.squares[y][x]) {
            return;
        }

        let nextStep = {
            squares:deepcopy(currentStep.squares),
            nextPlayer:currentStep.nextPlayer === 'X' ? 'O' : 'X',
            dropAt:[x, y]
        };
        nextStep.squares[y][x] = currentStep.nextPlayer;

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
            if (index === 0) desc = `goto start`;
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
        let status = 'next player :' + step.nextPlayer;
        this.winner = calcWinner(step.squares,step.dropAt,this.props.condition);
        if (this.winner) {
            status = 'winner is ' + this.winner;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={step.squares} handleClick={(x, y) => this.handleClick(x, y)} width={this.props.width} />
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

    if (!dropAt) return null;
    let [x, y] = dropAt;
    if (x >= squares[0].length || y >= squares.length) {
        throw Error(`calcWiner dropAt ${dropAt} squares size (${squares[0].length},${squares.length}) outside`);
    }
    let player = squares[y][x];
    let directions = [[1,0],[0,1],[1,1],[1,-1]];

    for(let i = 0; i < directions.length; i++) {
        if(maxLength(directions[i],dropAt,squares,player) >= condition) {
            return player;
        }
    }

    return null;
}

function maxLength(direction,dropAt,squares,player) {
    let length = 0;
    let [x,y] = dropAt
    let [a,b] = [false,false];
    // 正向检索
    while(squares[y][x] === player) {
        a = true;
        length += 1;
        x += direction[0];
        y += direction[1];
    }

    [x,y] = dropAt;
    // 反向检索
    while(squares[y][x] === player) {
        b = true;
        length += 1;
        x -= direction[0];
        y -= direction[1];
    }
    if(a&&b) length -= 1;
    return length;
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
