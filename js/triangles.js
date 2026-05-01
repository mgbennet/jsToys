document.addEventListener("DOMContentLoaded", function (event) {
	var c = document.getElementById("myCanvas"),
		ctx = c.getContext("2d"),
		H = Math.sqrt(3) / 2,
        triangleSlope = Math.tan(Math.PI / 3),
		triangles = [],
		drawGrid = true
		drawOutline = false,
		squeezeTogether = false;

	function Triangle(x, y, side) {
		//For upwards facing triangle, use negative 'side' value
		this.x = x;
		this.y = y;
		this.side = side;
		this.centerX = x + side / 2;
		this.centerY = y + side * H / 2;
		// centroidX is equal to centerX
		this.centroidY = y + (H * side / 3);
		this.color = getRandomColor(0, 100, 50, 8);

		this.drawStroke = function (scale) {
			ctx.beginPath();
			var tempX = this.centerX - .5 * scale * this.side;
			var tempY = this.centroidY - scale * this.side * H / 3;
			ctx.moveTo(tempX, tempY);
			ctx.lineTo(tempX + this.side * scale, tempY);
			ctx.lineTo(tempX + this.side / 2 * scale, tempY + this.side * H * scale);
			ctx.lineTo(tempX, tempY);

			ctx.stroke();
		}

		this.drawUnscaled = function () {
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.side, this.y);
			ctx.lineTo(this.x + this.side / 2, this.y + this.side * H);
			ctx.lineTo(this.x, this.y);
			ctx.fillStyle = this.color;

			ctx.stroke();
		}

		this.drawScaled = function (mousePos) {
			var distance = Math.sqrt(Math.pow(mousePos.x - this.centerX, 2) + Math.pow(mousePos.y - this.centroidY, 2));
			var scale = Math.sqrt(Math.max(1 - (distance / 100), 0));
			if (scale > 0.01) {
				ctx.beginPath();
				var tempX = this.centerX - .5 * scale * this.side;
				var tempY = this.centroidY - scale * this.side * H / 3;
				if (squeezeTogether) {
					const xVector = (mousePos.x - this.centerX);
					const yVector = (mousePos.y - this.centroidY);
        			const intersect = triangleIntersection(xVector, yVector, side);
					tempX += (xVector > 0 ? Math.min(xVector, intersect.x) : Math.max(xVector, intersect.x)) * (1 - scale);
					tempY += (yVector > 0 ? Math.min(yVector, intersect.y) : Math.max(yVector, intersect.y)) * (1 - scale);
				}
				ctx.moveTo(tempX, tempY);
				ctx.lineTo(tempX + this.side * scale, tempY);
				ctx.lineTo(tempX + this.side / 2 * scale, tempY + this.side * H * scale);
				ctx.lineTo(tempX, tempY);
				ctx.fillStyle = this.color;
				ctx.fill();
				if (drawOutline)
					ctx.stroke();
			}
			if (drawGrid) {
				this.drawUnscaled();
			}
		}
	}

	function rowOfTriangles(y, side, startDown) {
		var numTriangles = Math.ceil(c.width / side) * 2;
		down = startDown;
		for (var i = 0; i <= numTriangles; i++) {
			if (startDown) {
				triangles.push(new Triangle(i * side - side / 2, y, side));
				triangles.push(new Triangle(i * side, y + side * H, side * -1));
			} else {
				triangles.push(new Triangle(i * side - side / 2, y + side * H, side * -1));
				triangles.push(new Triangle(i * side, y, side));
			}
		}
	}

	function fillWithTriangles(side) {
		var numRows = Math.ceil(c.height / (side * H));
		var down = true;
		for (var i = 0; i <= numRows; i++) {
			rowOfTriangles(i * H * side, side, down);
			down = !down;
		}
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x : evt.clientX - rect.left,
			y : evt.clientY - rect.top
		}
	}

	// Given a vector from the center of a triangle, calculates where that
	// vector will hit the side of an equalatoral triangle. A negative side
	// value indicates a triangle with the point facing upwards.
	function triangleIntersection(x, y, side) {
		const slope = y / x || 0;
		if (side < 0) {
			x = -x;
			y = -y;
		}
		let xcoord, ycoord;
		if (
			(x > 0 && slope < -1 * triangleSlope ** -1) ||
			(x < 0 && slope > triangleSlope ** -1) ||
			(x == 0 && y < 0)
		) {
			ycoord = -1/3 * H * side;
			xcoord = -(1 / slope) * H * side * 1/3;
		} else {
			if (x > 0) {
				xcoord = (2/3 * H * side) / (slope + triangleSlope);
				ycoord = -1 * triangleSlope * xcoord + 2/3 * H * side;
			} else {
				xcoord = (-2/3 * H * side) / (slope - triangleSlope) * -1;
				ycoord = triangleSlope * xcoord - 2/3 * H * side * -1;
			}

		}
		return {
			x: xcoord,
			y: ycoord
		}
	}

	document.getElementById("drawGrid").onclick = function (evt) {
		drawGrid = (document.getElementById("drawGrid").checked);
		drawFrame(evt);
	}

	document.getElementById("drawOutline").onclick = function (evt) {
		drawOutline = (document.getElementById("drawOutline").checked);
		drawFrame(evt);
	}

	document.getElementById("squeeze").onclick = function (evt) {
		squeezeTogether = (document.getElementById("squeeze").checked);
		drawFrame(evt);
	}

	fillWithTriangles(50);
	for (var tri in triangles) {
		triangles[tri].drawStroke();
	}
	var drawFrame = function (evt) {
		ctx.clearRect(0, 0, c.width, c.height);
		var mousePos = getMousePos(c, evt);
		for (var tri in triangles) {
			triangles[tri].drawScaled(mousePos);
		}
	}

	document.addEventListener('mousemove', drawFrame, false);
	drawFrame({
		clientX : -500,
		clientY : -500
	});
});

function rand(min, max) {
	return min + Math.random() * (max - min);
}

function HSLstring(hslArray) {
	return "hsl(" + hslArray[0] + "," + hslArray[1] + "%," + hslArray[2] + "%)";
}

function getRandomColor(baseH, baseS, baseL, range) {
	var h = baseH + rand(-range, range);
	var s = baseS + rand(-range, range);
	if (s > 100) s = 100;
	if (s < 0) s = 0;
	var l = baseL + rand(-range, range);
	if (l > 100) l = 100;
	if (l < 0) l = 0;
	return HSLstring([h, s, l]);
}
