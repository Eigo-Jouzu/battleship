const boards = document.querySelectorAll(".board");

function buildBoard(board) {
	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			const div = document.createElement("div");

			div.dataset.row = row;
			div.dataset.col = col;

			if (row == 0 || col == 0) {
				div.classList.add("label");
			} else {
				div.classList.add("cell");
			}
			board.append(div);
		}
	}
}

boards.forEach(buildBoard);