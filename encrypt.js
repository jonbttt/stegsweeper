var aesjs = require('aes-js');

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

function hex2Bin(s) {
	var ret = [];
	len = s.length;
	for (var i = 0; i < len; i++) {
		ret = ret.concat(hex2BinMap[s[i]]);
	}

	return ret;
}

export function encrypt(key, message) {
	var keyBytes = aesjs.utils.utf8.toBytes(key);
	var messageBytes = aesjs.utils.utf8.toBytes(message);

	var aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter());
	var encryptedBytes = aesCtr.encrypt(messageBytes);

	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	var encryptedHexKey = aesjs.utils.hex.fromBytes(keyBytes);

	return hex2Bin(encryptedHexKey).concat(hex2Bin(encryptedHex));
}