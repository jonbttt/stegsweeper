# StegSweeper
Steganography using the game Minesweeper

## Minesweeper
Minesweeper is a puzzle video game in which mines are spread on a board. Each cell in the board is first blank and clickable. Clicking a cell will reveal whether the cell is a mine, blank, or a number. Revealing a mine causes the player to lose. Revealing a blank cell will also reveal all adjacent non-revealed tiles. A numbered cell shows the number of mines that surround the cell. The player can also flag cells when they believe the cell contains a mine. The number of flags available equals the number of mines planted on the board.

## Steganography Method
A 16-letter key is first chosen and converted to bits. The message is then encrypted using AES-128, converted to bits, and appended to the key. This gives us the setup for our minesweeper board. Every 0 will be a blank space and every 1 will be a mine.
