var aesjs = require('aes-js');

let board = [];

function init() {
	var game = document.getElementById("game");
	
	board = Array(rows).fill(null).map(() => 
		Array(cols).fill({ revealed: false, flagged: false, mine: false, 
						   nearMines: 0 }));
	const encryptedBytes = encrypt();
	placeMines();
	setNumbers();

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
		}
	}
}

function encrypt() {
	var key = document.getElementById("key");
	var message = document.getElementById("message");

	var keyBytes = aesjs.utils.utf8.toBytes(key);
	var messageBytes = aesjs.utils.utf8.toBytes(message);

	var aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter());
	
	return aesCtr.encrypt(messageBytes);
}

function placeMines() {
	let minesPlaced = 0;
}