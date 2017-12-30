var data = [];

var running = false;

var solution;

var first;

var alteredSquares;


$("form").submit(function(e) {

	data = [];

	alteredSquares = [];

	e.preventDefault();
	puzzleData = $("form").serializeArray();

	var tempRow = [];

	for (var j = 0; j < 9; j++) {

		for (var i = 0; i < 9; i++) {

			if (puzzleData[(j * 9) + i].value === "") {

				tempRow.push(0);
			}

			else {
			
				tempRow.push(parseInt(puzzleData[(j * 9) + i].value));
			}
		}

		data.push(tempRow);
		tempRow = [];
	}

	running = true;

	first = firstEmpty(data);

	solution = solveSodoku(1,0,0, false);

	

	while (running) {

		update();
	}
});



var solveSodoku = function(value, x, y, backTracking) {

	if (first === false) {

		running = false;
		return "full";
	}

	else if (data[y][x] !== 0 && backTracking === false) {

		if (x < 8) {

			return {value: 1, x: (x + 1), y: y, backTracking:false};
		}

		else if (y < 8) {

			return {value: 1, x:0, y: (y + 1), backTracking:false};
		}

		else {

			running = false;
			insertSolution(data);
			return data;
		}
	}

	else {

		if (checkRow(value, x, y) && checkColumn(value, x, y) && checkSquare(value, x, y) && value <= 9) {

			data[y][x] = value;
			alteredSquares.push({x: x, y: y});

			if (x < 8) {

				return {value: 1, x: (x + 1), y:y, backTracking:false};
			}

			else if (y < 8) {

				return {value: 1, x: 0, y: (y + 1), backTracking:false};
			}

			else {

				running = false;
				insertSolution(data);
				return data;
			}
		}

		else if (value < 9) {

			return {value: (value + 1), x:x, y:y, backTracking:backTracking};
		}

		else {

			if (x === first.x && y === first.y) {

				running = false;
				return "no solution";
			}

			data[y][x] = 0;
			var tempY = alteredSquares[alteredSquares.length - 1].y;
			var tempX = alteredSquares[alteredSquares.length - 1].x;
			alteredSquares.splice(alteredSquares.length - 1, 1);

			if (data[tempY][tempX] < 9) {

				return {value: data[tempY][tempX] + 1, x:tempX, y:tempY, backTracking:true};
			}

			else {

				return {value: 10, x:tempX, y:tempY, backTracking:true};
			}
		}
	}
}

var checkRow = function(value, x, y) {

	for (var i = 0; i < 9; i++) {

		if (data[y][i] === value && i !== x) {

			return false;
		}
	}

	return true;
}

var firstEmpty = function(board) {

	for (var i = 0; i < board.length; i++) {

		for (var j = 0; j < board[i].length; j++) {

			if (board[i][j] === 0) {

				return {x:j, y:i};
			}
		}
	}

	return false;
}

var checkColumn = function(value, x, y) {

	for (var i = 0; i < 9; i++) {

		if (data[i][x] === value && i !== y) {

			return false;
		}
	}

	return true;
}

var checkSquare = function(value, x, y) {

	var startX = (Math.floor(x/3) * 3)
	var startY = (Math.floor(y/3) * 3)

	for (var i = startY; i < startY + 3; i++) {

		for (var j = startX; j < startX + 3; j++) {

			if (data[i][j] === value && i !== y && j !== x) {

				return false;
			} 
		}
	}

	return true;
}

var update = function() {

	if (solution !== undefined) {
		
		if (solution === "full") {

			running = false;
		}

		else if (solution === "no solution") {

			running = false;
		}

		else {
		
			solution = solveSodoku(solution.value, solution.x, solution.y, solution.backTracking);
		}
	}
}


var insertSolution = function(answer) {

	var rowNumber;
	var columnNumber;
	var selector;

	for (var i = 0; i < 9; i++) {

		var tableRow = $("#r" + (i + 1));

		for (var j = 0; j < 9; j++) {

			rowNumber = i + 1;
			columnNumber = j + 1;

			selector = "#r" + rowNumber + " td" + ":nth-child(" + columnNumber + ")" + " input";
			
			//console.log(selector);

			document.querySelector(selector).value = answer[i][j].toString();

			//$(selector).attr("value", answer[i][j].toString());

		}
	}
}
