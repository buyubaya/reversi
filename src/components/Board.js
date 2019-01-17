import React, { Component } from 'react';


class Board extends Component {
    constructor(){
        super();

        this.state = {
            size: 8,
            board: [],
            currentPlayer: 1,
            validCell: null,
            cannotPlay: null,
            isEnd: false
        };

        this._move = this._move.bind(this);
    }

    componentWillMount(){
        this._initBoard();
    }

    componentDidMount(){
        this._showMoveInfo();
    }

    _initBoard(){
        let { board, size } = this.state;

        for(let i=0, len=this.state.size; i < len; i++){
            board[i] = [];
            for(let j=0, len=this.state.size; j < len; j++){
                board[i].push(null);
            }
        }

        board[size / 2 - 1][size / 2 - 1] = 1;
        board[size / 2 - 1][size / 2 ] = -1;
        board[size / 2][size / 2 - 1] = -1;
        board[size / 2][size / 2 ] = 1;

        this.setState({ board });
    }

    _move(loc){
        if(this._isValidCell(loc)){
            let { board, currentPlayer, validCell } = this.state;

            // fill the board
            board[loc[0]][loc[1]] = currentPlayer;
            // replace the cell
            const key = `${loc[0]}_${loc[1]}`;
            const replaceCell = validCell[key];
            replaceCell.forEach(item => board[item[0]][item[1]] = currentPlayer);
            // change player
            this.setState({ board });
            setTimeout(() => this._nextTurn(), 0);
        }
        else {
            alert('INVALID MOVE !');
        }
    }

    _nextTurn(){
        this.setState(
            state => ({ currentPlayer: -state.currentPlayer }),
            () => this._showMoveInfo()
        );
    }

    _showMoveInfo(){
        let { currentPlayer } = this.state;

        const validCell = this._findAllValidCell(currentPlayer);
        if(Object.keys(validCell).length > 0){
            this.setState({ validCell });
        }
        else {
            this.setState(
                { cannotPlay: currentPlayer },
                () => {
                    setTimeout(() => {
                        const nextValidCell = this._findAllValidCell(-currentPlayer);
                        if(Object.keys(nextValidCell).length > 0){
                            this.setState({ cannotPlay: null });
                            this._nextTurn();
                        }
                        else {
                            this.setState({ isEnd: true });
                        }
                    }, 2000)
                }
            );
        }
    }

    _findValidCell(currentLoc, currentPlayer, tmp={}){
        const { board, size } = this.state;
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

        let [currentI, currentJ] = currentLoc;
        for(let x=0, len=dirs.length; x < len; x++){
            let found = [];
            let newI = currentI + dirs[x][0];
            let newJ = currentJ + dirs[x][1];
            while(newI > -1 && newJ > -1 && newI < size && newJ < size){
                if(board[newI][newJ] === null){
                    if(found.length > 0){
                        let key = `${newI}_${newJ}`;
                        if(tmp[key]){
                            found.forEach(item => tmp[key].push(item));
                        }
                        else {
                            tmp[key] = found;
                        }
                    }
                    break;
                }
                else if(board[newI][newJ] === -currentPlayer){
                    found.push([newI, newJ]);
                }
                else if(board[newI][newJ] === currentPlayer){
                    break;
                }

                newI = newI + dirs[x][0];
                newJ = newJ + dirs[x][1];
            }
        }

        return tmp;
    }

    _findAllValidCell(currentPlayer){
        let tmp = {};
        const { board, size } = this.state;
        
        for(let i=0; i < size; i++){
            for(let j=0; j < size; j++){
                if(board[i][j] === currentPlayer){
                    tmp = this._findValidCell([i, j], currentPlayer, tmp);
                }
            }
        }

        return tmp;
    }

    _isValidCell(loc){
        const { validCell } = this.state;
        const key = `${loc[0]}_${loc[1]}`;
        if(validCell && validCell[key]){
            return true;
        }
        return false;
    }

	render(){
        const { board, size, currentPlayer, cannotPlay, isEnd } = this.state;
        const styles = {
            board: {
                width: size * 50
            },
            cell: {
                width: 50,
                height: 50
            }
        };
        
		return (
			<div>
                <table className='board' style={styles.board}>
                    <tbody>
                    {
                        board.map((row, i) =>
                            <tr key={i}>
                                {
                                    row.map((cell, j) =>
                                        <td 
                                            key={j}
                                            className={this._isValidCell([i, j]) ? 'cell isValid' : 'cell'} 
                                            style={styles.cell}
                                            onClick={() => this._move([i, j])}
                                        >
                                            {
                                                cell === 1 &&
                                                <span className='cell-B'></span>
                                            }
                                            {
                                                cell === -1 &&
                                                <span className='cell-W'></span>
                                            }
                                        </td>
                                    )
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            
                <div>
                    {
                        isEnd &&
                        <h1>GAME OVER !</h1>
                    }
                    {
                        cannotPlay &&
                        <h1>{cannotPlay === 1 ? 'Black' : 'White'} CANNOT PLAY</h1>
                    }
                    <span>Current Player: </span>
                    <span>{currentPlayer === 1 ? 'Black' : 'White'}</span>
                </div>
            </div>
		);
	}
}


export default Board;
