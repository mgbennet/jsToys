document.addEventListener("DOMContentLoaded", function (event) {
	var c = document.getElementById("myCanvas"),
	ctx = c.getContext("2d"),
	H = Math.sqrt(3) / 2,
	triangles = [],
	drawGrid = true,
	drawOutline = false;

	function Triangle(x, y, side) {
		//For upwards facing triangle, use negative 'side' value
		this.x = x;
		this.y = y;
		this.centerX = x + side / 2;
		this.centerY = y + side * H / 2;
		this.side = side;
		this.color = '#55FF77';

		this.drawStroke = function (scale) {
			ctx.beginPath();
			var tempX = this.x + .5 * (1 - scale) * this.side;
			var tempY = this.y + .5 * (1 - scale) * this.side * H;
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

		this.drawScaled = function (scale) {
			ctx.beginPath();
			var tempX = this.x + .5 * (1 - scale) * this.side;
			var tempY = this.y + .5 * (1 - scale) * this.side * H;
			ctx.moveTo(tempX, tempY);
			ctx.lineTo(tempX + this.side * scale, tempY);
			ctx.lineTo(tempX + this.side / 2 * scale, tempY + this.side * H * scale);
			ctx.lineTo(tempX, tempY);
			ctx.fillStyle = this.color;
			ctx.fill();
			if (drawGrid)
				this.drawUnscaled();
			if (drawOutline)
				this.drawStroke(scale);
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

	document.getElementById("gridToggle").onclick = function (evt) {
		drawGrid = (document.getElementById("drawGrid").checked);
		drawFrame(evt);
	}

	document.getElementById("outlineToggle").onclick = function (evt) {
		drawOutline = (document.getElementById("drawOutline").checked);
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
			var t = triangles[tri];
			var distance = Math.sqrt(Math.pow(Math.abs(mousePos.x - t.centerX), 2) + Math.pow(Math.abs(mousePos.y - t.centerY), 2));
			var scale = Math.pow(Math.max(1 - (distance / 100), 0), .5);
			t.drawScaled(scale);
		}
	}

	document.addEventListener('mousemove', drawFrame, false);
	drawFrame({
		clientX : -500,
		clientY : -500
	});
});
