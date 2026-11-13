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

// Game state variables
let gameStarted = false;
let selectedShip = null;
let isVertical = false;

// Board selectors
const boards = document.querySelectorAll(".board");
const shipyard = document.querySelector(".shipyard");
const playerBoard = document.querySelector(".player");
const opponentBoard = document.querySelector(".opponent");

// Buttons
const rotateButton = document.querySelector(".button-rotate");
const resetButton = document.querySelector(".button-reset");
const readyButton = document.querySelector(".button-ready");

function setUpButtons() {
	rotateButton.addEventListener("click", rotateShip);
	resetButton.addEventListener("click", resetBoard);
	readyButton.addEventListener("click", readyState);
}

// Construct game board
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
		const shipIndex = this.dataset.shipIndex;
		if (shipIndex !== undefined) {
			removeShip(shipIndex);
		}
	} else if (selectedShip !== null && gameStarted === false) { // If a ship is selected but the game hasn't started
		placeShip(this);
	} else if (gameStarted === true) { // If a ship is not selected but the game has started
		receiveHit(this); // Check for a hit on player's ships and place the appropriate hit/miss marker on the player's board
	}
}

// Places the selected ship in the adjacent cells
// For each ship, the length is defined from the `ships` array
// Then the board is checked to make sure there is enough space for the ship
// If so, the ship is drawn on the board
// The ship is then removed from the tray so that it can't be placed again
function placeShip(cell) {
	// Variables that don't change: start row, start column, the board, the ship's length
	const startRow = Number(cell.dataset.row);
	const startCol = Number(cell.dataset.col);
	const shipLength = ships[selectedShip].length;

	// CHECK pass: for each square i of the ship
	//      work out this square's row and column (isVertical decides which one moves)
	//      find its cell on the board
	//      if there's no cell, or it already has a ship: return (nothing drawn)

	for (let i = 0; i < shipLength; i++) {
		const selection = getShipCell(startRow, startCol, i, playerBoard);
		if (selection === null || selection.classList.contains("ship-placed")) {
			return;
		}
	}

	// DRAW pass: for each square i of the ship
	//      work out the row and column the same way
	//      find the cell and add "ship-placed"
	for (let i = 0; i < shipLength; i++) {
		const selection = getShipCell(startRow, startCol, i, playerBoard);
		selection.classList.add("ship-placed");
		selection.dataset.shipIndex = selectedShip;
	}
	markShipUsed();
	updateReadyButton();
}

// Decide whether or not a hit was successful when a shot is fired
function receiveHit(cell) {
	cell.classList.toggle("selected-player");
}

// Finds the current cell when placing a ship
// Takes the starting column number, starting row number, the current loop's `i`, and the game board's name as arguments
// Checks for rotation so the cells are returned in the correct orientation 
// Returns `selection` as a cell, or null if empty, with the current row and column
function getShipCell(startRow, startCol, i, board) {
	let currentRow = startRow;
	let currentCol = startCol;

	if (isVertical) {
		currentRow = startRow + i;
	} else {
		currentCol = startCol + i;
	}
	const selection = board.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);

	return selection;
}

function rotateShip() {
	isVertical = !isVertical;
	rotateButton.classList.toggle("vertical", isVertical);
}

// Remove the SELECTED ship from the tray, and reset the ship selection to nothing
function markShipUsed() {
	const shipUsed = shipyard.querySelector(".ship-selected");
	shipUsed.classList.remove("ship-selected");
	shipUsed.classList.add("ship-used");
	selectedShip = null;
}

function clearCell(shipPlaced) {
	shipPlaced.classList.remove("ship-placed");
	shipPlaced.removeAttribute("data-ship-index");
}

function resetBoard() {
	for (let i = 0; i <= (ships.length - 1); i++) {
		removeShip(i);
	}
}

// Remove the SELECTED ship from the board, and set selectedShip back to "nothing"
function removeShip(index) {
	const allShipsPlaced = playerBoard.querySelectorAll(`[data-ship-index="${index}"]`);
	allShipsPlaced.forEach(clearCell);

	restoreShip(index);
}

function restoreShip(index) {
	const shipUsed = shipyard.querySelector(`[data-ship-index="${index}"]`);
	shipUsed.classList.remove("ship-used");
	updateReadyButton();
}

// Mark locations of shots against opponent
function selectOpponentCell() {
	if (gameStarted === false) { return; }
	this.classList.toggle("selected-opponent");
}

function updateReadyButton() {
	const hasRemainingShips = shipyard.querySelector(".ship:not(.ship-used)");
	readyButton.disabled = hasRemainingShips;
}

function readyState() {
	const opponentBoardTitle = document.querySelector(".board-name-opponent");

	shipyard.classList.add("hidden");
	opponentBoard.classList.remove("hidden");
	opponentBoardTitle.textContent = "Opponent's Game Board";
	rotateButton.disabled = true;
	resetButton.disabled = true;
	readyButton.disabled = true;
}

// Draw shipyard
function buildShipyard(shipyard) {
	for (let shipCount = 0; shipCount < ships.length; shipCount++) {
		const shipDiv = document.createElement("div");
		shipDiv.classList.add("ship");
		shipDiv.dataset.shipIndex = shipCount;
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
	const prevShip = shipyard.querySelector(".ship-selected");
	if (this.classList.contains("ship-used")) {
		return;
	}

	if (gameStarted === false) {
		if (prevShip === null) {
			this.classList.add("ship-selected");
			selectedShip = Number(this.dataset.shipIndex);
		} else {
			prevShip.classList.remove("ship-selected");
			if (prevShip === this) {
				selectedShip = null;
				return;
			}
			this.classList.add("ship-selected");
			selectedShip = Number(this.dataset.shipIndex);
		}
	}
}

// Draw game boards
boards.forEach(buildBoard);
// Draw ship tray
buildShipyard(shipyard);
// Draw buttons with default settings
setUpButtons();
// Enable Ready button if all ships have been placed on the board
updateReadyButton();