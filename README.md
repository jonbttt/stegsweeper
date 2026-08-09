# StegSweeper
Steganography using the game Minesweeper

Minesweeper is a puzzle video game in which mines are spread on a board. Each cell in the board is first blank and clickable. Clicking a cell will reveal whether the cell is a mine, blank, or a number. Revealing a mine causes the player to lose. Revealing a blank cell will also reveal all adjacent non-revealed tiles. A numbered cell shows the number of mines that surround the cell. The player can also flag cells when they believe the cell contains a mine. The number of flags available equals the number of mines planted on the board. The game's goal is to plant the flags on each of the mines and to reveal all non-mine cells.

This was my first security project, built to explore how a covert channel can be hidden inside a game that I personally enjoy.

To run, click [here](https://jonbttt.github.io/stegsweeper)

## Steganography Method
1. A 16-character key is entered, giving a 128-bit AES key.
2. The message is encrypted with AES-128 in CTR mode.
3. The key and the ciphertext are both converted to hex, then to a bitstream: the 128 key bits first, followed by the ciphertext bits.
4. Board dimensions are derived from the payload length, sized so the payload fits with room to spare.
5. The bitstream is written into every third cell of the board in row-major order. A 1 places a mine, a 0 leaves the cell clear.
6. The remaining two thirds of the cells are mined at random with roughly a 1 in 12 chance each, so the board looks populated rather than sparse and the payload cells are not the only mines present.

## Decoding
Every third cell would contain a valid bit. The decoder takes the raw bitstream, splits off the first 128 bits as the key, treats the remainder as ciphertext, and decrypts with AES-CTR. Since this is just a PoC, the bitstream is available by opening the console.

## Limitations
- **The key is embedded in the carrier in plaintext.** The first 128 bits of the payload are the key itself, so anyone who knows the scheme can read the board, recover the key and decrypt the message. Security therefore rests entirely on the scheme staying secret, which is exactly what good cryptography should never depend on.
- **CTR mode is used with a default counter.** Encrypting two different messages under the same key reuses the keystream, which is a well-known way to break CTR. A random nonce per message, stored alongside the ciphertext, would fix this.
- **The board is not statistically innocent.** Payload cells are mined according to the ciphertext while filler cells are mined at a fixed 1 in 12 probability. An analyst comparing mine density across the every-third-cell positions against the rest could distinguish a carrier board from a genuine one.
- **The decoder does not read the board.** It takes the bitstream directly, so the round trip is not yet demonstrable end to end from a rendered board.
- **Capacity is low.** One bit per three cells, so message length is tightly bounded by board size.
Steganography hides the fact that a message exists; it does not make the message secure. Here AES does the confidentiality work, and the board only conceals that something is being transmitted at all.

## What I would do differently
- Derive the key from a passphrase using a KDF rather than embedding it in the carrier.
- Use a random nonce per message instead of a default CTR counter.
- Match the payload cells' mine distribution to the filler distribution so the two are statistically indistinguishable.
- Add board-to-bitstream extraction so the decoder works from a rendered board.
