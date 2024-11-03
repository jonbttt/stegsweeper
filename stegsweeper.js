var aesjs = require('./node_modules/aes-js/index.js');

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

var rows = 0;
var cols = 0;

const game = document.getElementById("game");
let board = [];

function init() {
	var key = document.getElementById("key").value;
	var message = document.getElementById("message").value;


	const encryptedBitsArr = encrypt(key, message);

	generateBoard(encryptedBitsArr);
	setNumbers();
}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	init();
	updateBoard();
});

function generateBoard(encryptedBitsArr) {
	const length = encryptedBitsArr.length;
	cols = Math.ceil(Math.ceil(Math.sqrt(length) / 0.8) / 4.0) * 4;
	rows = Math.ceil(length / cols) * 3;

	for (let row = 0; row < rows; row++) {
		board[row] = [];

		for (let col = 0; col < cols; col++) {
			board[row][col] = {
				mine: false,
				nearMines: 0,
				flagged: false,
				revealed: false
			}
		}
	}
	
	var i = 0;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (i > length) {
				i++;
				return;
			}

			if ((row * cols + col) % 3 == 0) {
				if (encryptedBitsArr[i] == 1) {
					board[row][col].mine = true;
				} else {
					board[row][col].mine = false;
				}

				i++;
			} else {
				let result = Math.floor(Math.random() * 12);
				if (result == 0) {
					board[row][col].mine = true;
				} else {
					board[row][col].mine = false;
				}
			}
		}
	}
}

function setNumbers() {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
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

	if (board[row][col].flagged == false) {
		board[row][col].flagged = true;
	} else {
		board[row][col].flagged = false;
	}

	updateBoard();
}

function updateBoard() {
	game.innerHTML = "";

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement("div");
			cell.className = "cell";

			if (board[row][col].revealed) {
				if (board[row][col].mine) {
					cell.classList.add("mine");
					cell.textContent = "*";
				} else {
					cell.classList.add("revealed");

					if (board[row][col].nearMines !== 0) {
						cell.textContent = board[row][col].nearMines;

						switch(board[row][col].nearMines) {
							case 1:
								cell.classList.add("number1");
								break;
							case 2:
								cell.classList.add("number2");
								break;
							case 3:
								cell.classList.add("number3");
								break;
							case 4:
								cell.classList.add("number4");
								break;
							case 5:
								cell.classList.add("number5");
								break;
							case 6:
								cell.classList.add("number6");
								break;
							case 7:
								cell.classList.add("number7");
								break;
							case 8:
								cell.classList.add("number8");
								break;
						}
					}
				}
			}

			if (board[row][col].flagged) {
				cell.classList.add("flag");
				cell.textContent = "`";
			}

			cell.addEventListener("click", () => revealCell(row, col));
			cell.addEventListener("contextmenu", () => flagCell(row, col));
			cell.addEventListener("contextmenu", e => e.preventDefault());
			game.appendChild(cell);
		}
		game.appendChild(document.createElement("br"));
	}
}

function gameOver() {
	if (confirm('Game Over! (Due to this being a demo, pressing \'cancel\' or \'esc\' will not refresh the page.)')) {
		window.location.reload();
	}

	/*
	if (!alert('Game Over!')) {
		window.location.reload();
	}
	*/
}

function hex2Bin(s) {
	var ret = [];
	const len = s.length;
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
