// Board labels
const people = ["Miku", "Kevin", "Bob", "Rina", "Becky", "Nene", "Takeru"];
const actions = ["play ice hockey", "eat sushi", "sing enka", "like natto", "love Kyary Pamyu Pamyu", "read Harry Potter", "cook dinner every day"];

// Draw game board
const boards = document.querySelectorAll(".board");

function buildBoard(board) {
	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			const div = document.createElement("div");

			if (row == 0 || col == 0) {
				div.classList.add("label");
				if (col > 0 && row == 0) {
					div.textContent = "Does\n" + people[col - 1];
				} else if (row > 0 && col == 0) {
					div.textContent = "... " + actions[row - 1] + "?";
				} else {
					div.textContent = "";
				}
			} else {
				div.classList.add("cell");
				div.dataset.row = row;
				div.dataset.col = col;
				div.addEventListener("click", selectCell);
			}
			board.append(div);
		}
	}
}

boards.forEach(buildBoard);

function selectCell() {
	this.classList.toggle("selected");
}