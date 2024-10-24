import aesjs from './node_modules/aes-js/index.js';

var hex2BinMap = {
	'0': [0, 0, 0, 0],
	'1': [0, 0, 0, 1],
	'2': [0, 0, 1, 0],
	'3': [0, 0, 1, 1],
	'4': [0, 1, 0, 0],
	'5': [0, 1, 0, 1],
	'6': [0, 1, 1, 0],
	'7': [0, 1, 1, 1],
	'8': [1, 0, 0, 0],
	'9': [1, 0, 0, 1],
	'a': [1, 0, 1, 0],
	'b': [1, 0, 1, 1],
	'c': [1, 1, 0, 0],
	'd': [1, 1, 0, 1],
	'e': [1, 1, 1, 0],
	'f': [1, 1, 1, 1]
}

const directions = [
	[-1, -1], [-1, 0], [-1, 1], [0, -1], 
	[0, 1], [1, -1], [1, 0], [1, 1]
];

const game = document.getElementById("game");
let board = [];

function init() {
	var key = document.getElementById("key");
	var message = document.getElementById("message");

	var key = "1234567890123456";
	var message = "helloooooo";

	const encryptedBitsArr = encrypt(key, message);
	console.log(encryptedBitsArr);

	generateBoard(encryptedBitsArr);
	setNumbers();
}

function generateBoard(encryptedBitsArr) {
	const length = encryptedBitsArr.length;
	const rows = Math.ceil(length * 0.8);
	const cols = Math.ceil(length / rows);

	for (const row = 0; row < rows; row++) {
		board[row] = [];

		for (const col = 0; col < cols; col++) {
			board[row][col] = {
				mine: false,
				nearMines: 0,
				flagged: false,
				revealed: false
			}
		}
	}
	
	var i = 0;

	for (const row of board) {
		for (const cell of row) {
			if (i > length) {
				i++;
				continue;
			}

			if (encryptedBitsArr[i] = 1) {
				cell.mine = true;
			}

			i++;
		}
	}
}

function setNumbers() {
	const rows = board.length;
	const cols = board[0].length;

	for (const row in board) {
		for (const col in row) {
			var count = 0;
			if (!board[row][col].mine) {
				for (const [x, y] of directions) {
					const checkRow = row + x;
					const checkCol = col + y;

					if ((checkRow >= 0 && checkRow < rows) &&
						(checkCol >= 0 && checkCol < cols) &&
						board[checkRow][checkCol].mine) {
						count++;
					}
				}

				board[row][col].nearMines = count;
			}
		}
	}
}

function revealCell(row, col) {
	const rows = board.length;
	const cols = board[0].length;

	if (row < 0 || row >= rows || col < 0 || col >= cols ||
		board[row][col].revealed || board[row][col].flagged
	) {
		return;
	}

	board[row][col].revealed = true;

	if (board[row][col].mine) {
		gameOver();
	} else if (board[row][col].nearMines == 0) {
		for (const [x, y] of directions) {
			const checkRow = row + x;
			const checkCol = col + y;

			revealCell(checkRow, checkCol);
		}
	}

	updateBoard();
}

function flagCell(row, col) {
	if (row < 0 || row >= rows || col < 0 || col >= cols ||
		board[row][col].revealed
	) {
		return;
	}

	board[row][col].flagged = true;

	updateBoard();
}

function updateBoard() {
	const rows = board.length;
	const cols = board[0].length;

	game.innerHTML = "";

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement("div");
			cell.className = "cell";

			if (board[row][col].revealed) {
				if (board[row][col].mine) {
					cell.classList.add("mine");
					cell.textContent = "*";
				} else if (board[i][j].nearMines !== 0) {
					cell.textContent = board[i][j].nearMines;
				}
			}

			if (board[row][col].flagged) {
				cell.classList.add("flag");
				cell.textContent = "`";
			}

			cell.addEventListener("click", () => revealCell(row, col));
			cell.addEventListener("contextmenu", () => flagCell(row, col));
			game.appendChild(cell);
		}
		game.appendChild(document.createElement("br"));
	}
}

function hex2Bin(s) {
	var ret = [];
	len = s.length;
	for (var i = 0; i < len; i++) {
		ret = ret.concat(hex2BinMap[s[i]]);
	}

	return ret;
}

function encrypt(key, message) {
	var keyBytes = aesjs.utils.utf8.toBytes(key);
	var messageBytes = aesjs.utils.utf8.toBytes(message);

	var aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter());
	var encryptedBytes = aesCtr.encrypt(messageBytes);

	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	var encryptedHexKey = aesjs.utils.hex.fromBytes(keyBytes);

	return hex2Bin(encryptedHexKey).concat(hex2Bin(encryptedHex));
}

init();
updateBoard();