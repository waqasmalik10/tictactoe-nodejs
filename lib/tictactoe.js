const readline = require('readline');
const chalk = require('chalk');

module.exports = () => {

	const BOARD_SIZE = 3, PLAYER_MARKS = ['X', 'O'], PLAYER_TYPES = ['human', 'computer'], ROW_SEPARATOR = '+-----------+';
	const _readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let _ticTacToeBoard = {}, _players = [];

    
	const _initGame = () => {
		_ticTacToeBoard = {
			board: [...new Array(BOARD_SIZE)].map( _=> [...new Array(BOARD_SIZE)].map(__=>null) ),
			empty: [...new Array(BOARD_SIZE)].map( (_, i)=> [...new Array(BOARD_SIZE)].map( (__, k)=> (i+' '+k) ) ).flat()
		};

		_players = [
			{
				marker: PLAYER_MARKS[0],
				type: PLAYER_TYPES[0]
			},
			{
				marker: PLAYER_MARKS[1],
				type: PLAYER_TYPES[1]
			}
		]

	}



	const _rotatePlayers = () => {
		_players.push( _players.shift() );
	}

	
	const _getPlayerMove = () => {
		const tmp = (_players[0].type == 'computer') ? _computerMove() : _userMove();
	}


	const _parsePosition = str => {
		return str.split(' ').map(num=>parseInt(num));
	}

	
	const _computerMove = () => {
		const index = Math.floor(Math.random() * _ticTacToeBoard.empty.length);
		const pos = _parsePosition(_ticTacToeBoard.empty[index]);

		setTimeout(function() {
			_addPlayerToBoard(pos);
		}, 1000);
	}


	const _userMove = () => {
		_readLine.question(`Your(${_players[0].marker}) move. Please choose empty cell. (enter row column): `, input => {
			const tmp = (_ticTacToeBoard.empty.indexOf(input) != -1) ? _addPlayerToBoard(_parsePosition(input)) : _userMove();
		});
	}

	


	const _addToBoard = (player, pos) => {
		_ticTacToeBoard.board[pos[0]][pos[1]] = player.marker; // Add player's position to the board
		const emptyIndex = _ticTacToeBoard.empty.indexOf(pos[0] + ' ' + pos[1]); // Remove this position from array of empty cells
		_ticTacToeBoard.empty.splice(emptyIndex, 1);
	}




	const _printBoard = () => {
		for (let i = 0; i < BOARD_SIZE; i += 1) {
			console.log( chalk.hex('#FFA500').bgWhite(ROW_SEPARATOR) );
			let row = '|';
			for (let k = 0; k < BOARD_SIZE; k += 1) {
				row += (_ticTacToeBoard.board[i][k]) 
						? ( ' ' + ( _ticTacToeBoard.board[i][k]=='X' ? chalk.green( _ticTacToeBoard.board[i][k] ) : chalk.red( _ticTacToeBoard.board[i][k] ) ) + ' |' )
						: '   |';
			}
			console.log( chalk.hex('#FFA500').bgWhite(row) );
		}
		console.log( chalk.hex('#FFA500').bgWhite(ROW_SEPARATOR) );
	}




	const _checkBoard = player => {
		const board = _ticTacToeBoard.board, playerStr = player.marker + player.marker + player.marker; 
		let winner = null, colStrs = ['', '', ''], diagStrs = ['', ''];

		for (let i = 0; i < BOARD_SIZE; i += 1) {

			// Check each row for a winner
			const rowStr = board[i].join('');

			if (rowStr == playerStr) {
				winner = player;
				break;
			}

			// Build a string of column values
			for (let k = 0; k < BOARD_SIZE; k += 1) {
				colStrs[k] += board[i][k];
			}

			// Build a string of diagonal values
			switch (i) {
				// Build a string of diagonal values
				case 0:
					diagStrs[0] += board[i][0];
					diagStrs[1] += board[i][2];
					break;
				case 1:
					diagStrs[0] += board[i][1];
					diagStrs[1] += board[i][1];
					break;
				case 2:
					diagStrs[0] += board[i][2];
					diagStrs[1] += board[i][0];
					break;
			}
			
		}

		// Check the column strings for a winner
		if (colStrs.indexOf(playerStr) > -1) {
			winner = player;
		}

		// Check the diagonals for a winner
		if (diagStrs.indexOf(playerStr) > -1) {
			winner = player;
		}

		if (winner) {
			console.log( 'You' + (winner.type==='human' ?  ' won!' : ' lost!') );
			return true;
		}

		return false;

	}
	

	
	const _addPlayerToBoard = pos => {
		_addToBoard(_players[0], pos);

		console.log('\u001b[2J\u001b[0;0H');
		_printBoard();

		if (_ticTacToeBoard.empty.length == 0) {
			console.log('Draw!');
			_readLine.close();
		} else {
			if (_checkBoard(_players[0])) {
				_readLine.close();
			} else {
				_rotatePlayers();
				_getPlayerMove(_players[0]);
			}
		}
	}






	const startGame = () => {
		_initGame();
		if (Math.random()> 0.5) _rotatePlayers();
		_getPlayerMove();
	}



	return {
		start: startGame
	}


};
