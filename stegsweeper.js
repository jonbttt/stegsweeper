import { encrypt } from './encrypt.js';

let board = [];

function init() {
	var game = document.getElementById("game");

	var key = document.getElementById("key");
	var message = document.getElementById("message");

	const encryptedBytesArr = encrypt(key, message);
	console.log(encryptedBytes);
	
	board = Array(rows).fill(null).map(() => 
		Array(cols).fill({ revealed: false, flagged: false, mine: false, 
						   nearMines: 0 }));

	placeMines();
	setNumbers();

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
		}
	}
}

function placeMines() {
	let minesPlaced = 0;
}