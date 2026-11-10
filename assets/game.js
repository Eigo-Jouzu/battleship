// Game data
// Column labels
const people = ["Miku", "Kevin", "Bob", "Rina", "Becky", "Nene", "Takeru"];
// Row labels
const actions = ["play ice hockey", "eat sushi", "sing enka", "like natto", "love Kyary Pamyu Pamyu", "read Harry Potter", "cook dinner every day"];
// Ships
const ships = [
	{
		name: "Aircraft Carrier",
		length: 5
	},
	{
		name: "Battleship",
		length: 4
	},
	{
		name: "Cruiser",
		length: 3
	},
	{
		name: "Submarine",
		length: 3
	},
	{
		name: "Destroyer",
		length: 2
	}];
// Max grid size
const GRID_SIZE = 7;

let gameStarted = false;
let selectedShip = null;
let isVertical = false;

// Construct game board
const boards = document.querySelectorAll(".board");

function buildBoard(board) {
	for (let row = 0; row <= GRID_SIZE; row++) {
		for (let col = 0; col <= GRID_SIZE; col++) {
			const div = document.createElement("div");

			if (row == 0 || col == 0) {
				if (col > 0 && row == 0) {
					div.classList.add("label-col");
					div.textContent = "Does\n" + people[col - 1];
				} else if (row > 0 && col == 0) {
					div.classList.add("label-row");
					div.textContent = "... " + actions[row - 1] + "?";
				} else {
					div.classList.add("table-corner");
					div.textContent = "";
				}
			} else {
				div.classList.add("cell");
				div.dataset.row = row;
				div.dataset.col = col;

				if (board.classList.contains("player")) {
					div.addEventListener("click", selectPlayerCell);
				} else if (board.classList.contains("opponent")) {
					div.addEventListener("click", selectOpponentCell)
				}
			}
			board.append(div);
		}
	}
}

// Mark player's ship locations and shots fired by opponent
function selectPlayerCell() {
	if (selectedShip === null && gameStarted === false) { // If there is no selected ship and the game hasn't started
		return;
	} else if (selectedShip !== null && gameStarted === false) { // If a ship is selected but the game hasn't started
		placeShip(this);
	} else if (gameStarted === true) { // If a ship is not selected but the game has started
		receiveHit(this); // Check for a hit on player's ships and place the appropriate hit/miss marker on the player's board
	}
}

function placeShip(cell) {
	// 1. Facts that don't change: start row, start column, the board, the ship's length
	const startRow = Number(cell.dataset.row);
	const startCol = Number(cell.dataset.col);
	const playerBoard = document.querySelector(".player");
	const shipLength = ships[selectedShip].length;

	// 2. CHECK pass: for each square i of the ship
	//      work out this square's row and column (isVertical decides which one moves)
	//      find its cell on the board
	//      if there's no cell, or it already has a ship: return (nothing drawn)
	for (let i = 0; i < shipLength; i++) {
		let currentRow = startRow;
		let currentCol = startCol;
		if (isVertical) {
			currentRow = startRow + i;
		} else {
			currentCol = startCol + i;
		}

		const selection = playerBoard.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);

		if (selection === null || selection.classList.contains("ship-placed")) {
			return;
		}
	}

	// 3. DRAW pass: for each square i of the ship
	//      work out the row and column the same way
	//      find the cell and add "ship-placed"
	for (let i = 0; i < shipLength; i++) {
		let currentRow = startRow;
		let currentCol = startCol;
		if (isVertical) {
			currentRow = startRow + i;
		} else {
			currentCol = startCol + i;
		}

		const selection = playerBoard.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
		selection.classList.add("ship-placed");
	}

	// 4. Tidy up: remove the SELECTED ship from the tray, and set selectedShip back to "nothing"
	document.querySelector(".ship-selected").remove(); // Remove the ship from the tray
	selectedShip = null;
}

function receiveHit(cell) {
	cell.classList.toggle("selected-player");
}

// Mark locations of shots against opponent
function selectOpponentCell() {
	if (gameStarted === false) { return; }
	this.classList.toggle("selected-opponent");
}

// Draw game board
boards.forEach(buildBoard);

// Draw shipyard
const shipyard = document.querySelector(".shipyard");

function buildShipyard(shipyard) {
	for (let shipCount = 0; shipCount < ships.length; shipCount++) {
		const shipDiv = document.createElement("div");
		shipDiv.classList.add("ship");
		shipDiv.dataset.ship = shipCount;
		shipDiv.addEventListener("click", selectShip);

		for (let i = 0; i < ships[shipCount].length; i++) {
			const shipSquare = document.createElement("div");

			shipSquare.classList.add("ship-square");
			shipDiv.append(shipSquare);
		}
		shipyard.append(shipDiv);
	}
}

// Toggle ship selection
function selectShip() {
	const prevShip = document.querySelector(".ship-selected");
	if (gameStarted === false) {
		if (prevShip === null) {
			this.classList.add("ship-selected");
			selectedShip = Number(this.dataset.ship);
		} else {
			prevShip.classList.remove("ship-selected");
			this.classList.add("ship-selected");
			selectedShip = Number(this.dataset.ship);
		}
	}
}

buildShipyard(shipyard);