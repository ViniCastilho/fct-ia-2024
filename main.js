function cloneExcept(arr, n) {
	let ret = [];
	for (let i = 0; i < arr.length; i++) {
		if (i != n) { ret.push(arr[i]); }
	}
	return ret;
}

let lib = {
	'gui': [],
	'board': [],
	'history': [],
	'isRunning': false,
	'moves': 0,
};

lib.playerClick = function (board, y, x) {
	if (lib.isRunning) return;
	let val = board[y][x];

	if (x+1 < 3 && board[y][x+1] == null) {
		// NULL para direita
		lib.moves++;
		board[y][x+1] = val;
		board[y][x] = null;
		lib.updateGraphicsMove(board, y, x, y, x+1);
	} else if (x-1 >= 0 && board[y][x-1] == null) {
		// NULL para esquerda
		lib.moves++;
		board[y][x-1] = val;
		board[y][x] = null;
		lib.updateGraphicsMove(board, y, x, y, x-1);
	} else if (y+1 < 3 && board[y+1][x] == null) {
		// NULL para baixo
		lib.moves++;
		board[y+1][x] = val;
		board[y][x] = null;
		lib.updateGraphicsMove(board, y, x, y+1, x);
	} else if (y-1 >= 0 && board[y-1][x] == null) {
		// NULL para cima
		lib.moves++;
		board[y-1][x] = val;
		board[y][x] = null;
		lib.updateGraphicsMove(board, y, x, y-1, x);
	}
}

lib.updateGraphicsMove = function (board, ny, nx, py, px) {
	lib.gui[0].style.gridRow = ny+1;
	lib.gui[0].style.gridColumn = nx+1;
	let pos = board[py][px];
	lib.gui[pos].style.gridRow = py+1;
	lib.gui[pos].style.gridColumn = px+1;
}

lib.updateGraphics = function (board) {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let num = board[i][j];
			if (num == null) {
				lib.gui[0].style.gridRow = i+1;
				lib.gui[0].style.gridColumn = j+1;
			} else {
				lib.gui[num].style.gridRow = i+1;
				lib.gui[num].style.gridColumn = j+1;
			}
		}
	}
}

lib.reset = function () {
	lib.board = [];
	for (let i = 0; i < 3; i++) {
		lib.board.push([]);
		for (let j = 0; j < 3; j++) {
			let num = (3*i)+j
			lib.board[i].push(num);
			let btn = document.querySelector(`#p${num}`);
			btn.style.gridRow = i+1;
			btn.style.gridColumn = j+1;
			btn.style.backgroundColor = '#55FF55';
			btn.addEventListener('click', function () {
				lib.playerClick(
					lib.board,
					Number(btn.style.gridRow)-1,
					Number(btn.style.gridColumn)-1
				);
			});
			lib.gui.push(btn);
		}
	}
	lib.board[0][0] = null;
	lib.isRunning = false;
	lib.moves = 0;
	lib.history = [];
}

lib.findBlank = function (board) {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[i][j] === null) { return (3*i)+j; }
		}
	}
	return null;
}

lib.avoidBacktrack = function (history, move) {
	let dupl = cloneExcept(history, -1);
	dupl.push(move);
	let pairs = Math.min(4, Math.floor(Math.sqrt(dupl.length)));
	console.log(`PAIRS ${pairs}`);
	if (dupl.length < 2 || pairs < 1) { return true; }
	console.log('EVAL');
	for (let i = 0; i < pairs; i++) {
		let half = 2**i;
		if (
			(dupl[i].y != dupl[half+i].y) ||
			(dupl[i].x != dupl[half+i].x)
		) { return true; }
	}
	return false;
}

lib.shuffle = function (board) {
	let max = 2+Math.floor(Math.random()*1);
	let pos = lib.findBlank(board);
	for (let i = 0; i < max; i++) {
		let options = [];
		let y = Math.floor(pos/3);
		let x = pos % 3;
		if (x+1 < 3)  { options.push({'y':y,  'x':x+1}); } else
		if (x-1 >= 0) { options.push({'y':y,  'x':x-1}); } else
		if (y+1 < 3)  { options.push({'y':y+1,'x':x  }); } else
		if (y-1 >= 0) { options.push({'y':y-1,'x':x  }); }
		let valid = false;
		let move = null;
		while (!valid && options.length > 0) {
			let rand = Math.floor(Math.random()*options.length);
			move = options[rand];
			options = cloneExcept(options, rand);
			valid = lib.avoidBacktrack(lib.history, move);
			console.log(i, move, valid);
		}
		console.log(`done ${valid} ${options.length}`);
		if (!valid) {
			console.log('fuck');
		} else {
			lib.history.push(move);
			board[y][x] = board[move.y][move.x];
			board[move.y][move.x] = null;
			pos = 3*move.y + move.x;
		}
	}
	console.log('outside');
	lib.updateGraphics(board);
}

lib.boardCost = function (board) {
	let cost = 0;
	for (let i = 0; i < 9; i++) {
		let cy = Math.floor(i/3);
		let cx = i % 3;
		let val = board[cy][cx];
		if (val == null) { continue; }
		val--;
		let fy = Math.floor(val/3);
		let fx = val % 3;
		cost += Math.abs(fy-cy) + Math.abs(fx-cx);
	}
	return cost;
}

document.querySelector('#btn-random').addEventListener('click', function () {
	lib.shuffle(lib.board);
});

lib.reset();
lib.boardCost(lib.board);