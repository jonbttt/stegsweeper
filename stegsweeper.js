import { encrypt } from './encrypt.js';

let board = [];

function init() {
	var game = document.getElementById("game");

	var key = document.getElementById("key");
	var message = document.getElementById("message");

	const encryptedBitsArr = encrypt(key, message);
	console.log(encryptedBitsArr);

	const board = generateBoard(encryptedBitsArr);
	setNumbers();

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = document.createElement("div");
			cell.classList.add("cell");
		}
	}
}

function generateBoard(encryptedBitsArr) {
	let mines = 0;

	for (const bit of encryptedBitsArr) {
		if (bit == 1) {
			mines++;
		}
	}

	var rows = 0;
	var cols = 0;

	const length = encryptedBitsArr.length;
	rows = Math.ceil(length * 0.8);
	cols = Math.ceil(length / rows);

	board = Array(rows).fill(null).map(() => 
		Array(cols).fill({ revealed: false, flagged: false, mine: false, 
						   nearMines: 0 }));
	
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