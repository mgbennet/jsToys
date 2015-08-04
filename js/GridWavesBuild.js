document.addEventListener("DOMContentLoaded", function(event) {

var squares = [],
	waves = [],
	numSquares = 17,
	baseHSL = [0, 100, 50],
	mouseoverHSL = [245, 100, 50],
	waveHSL = [143, 100, 50];

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
}) ();

function SqrObj(x, y, div, color) {
	this.x = x;
	this.y = y;
	this.div = div;
	this.baseColor = color;	
}

SqrObj.prototype.makeGreen = function() {
	this.div.style.backgroundColor = HSLstring(waveHSL);
}

SqrObj.prototype.makeBase = function() {
	this.div.style.backgroundColor = this.baseColor;
}

SqrObj.prototype.distance = function(tarX, tarY) {
	//could square the comparison to not calculate the sqrt
	return Math.sqrt(Math.pow(tarX-this.x, 2) + Math.pow(tarY-this.y, 2));
}

function Wave(x, y) {
	this.x = x;
	this.y = y;
	this.time = 0;
	//duration is only as long as needed for wave to reach furthest corner
	var corners = [squares[0][0], 
		squares[numSquares-1][0], 
		squares[0][numSquares-1], 
		squares[numSquares-1][numSquares-1]],
		maxDist = corners.reduce(function(dist, corner) {
			return Math.max(dist, corner.distance(x, y));
		}, 0);
	this.duration = (maxDist+5)*30;
}

Wave.prototype.animate = function() {
	this.time++;
	var radius = this.time/30;
	for (var i = 0; i < numSquares; i++) {
		for (var j = 0; j < numSquares; j++) {
			var dist = squares[i][j].distance(this.x, this.y)
			if (dist <= radius && dist >= radius-3) {
				squares[i][j].makeGreen();
			} else if (dist < radius-3 && dist >= radius-5) {
				squares[i][j].makeBase();
			}
		}
	}
};

Wave.prototype.isDone = function() {
	return this.time >= this.duration;
}

function rand(min, max) {
	return min + Math.random() * (max - min);
}

function HSLstring(hslArray) {
	return "hsl(" + hslArray[0] + "," + hslArray[1] + "%," + hslArray[2] + "%)";
}

function getRandomColor(baseH, baseS, baseL, range) {
	var h = baseH + rand(-1*range, range);
	var s = baseS + rand(-1*range, range);
	if (s > 100) s = 100;
	if (s < 0) s = 0;
	var l = baseL + rand(-1*range, range);
	if (l > 100) l = 100;
	if (l < 0) l = 0;
	return HSLstring([h, s, l]);
}

function makeSquares(num) {
	var sqrsDiv = document.getElementById("randomSquares");
	document.getElementById("wrapper").style.width = 30*num+"px";
	
	for (var i = 0; i < num; i++) {
		var row = document.createElement("div"),
			rowArray = [];
		row.setAttribute("class", "row");
		row.style.width = 30*num+"px";
		sqrsDiv.appendChild(row);
		squares.push(rowArray);
		for (var j = 0; j < num; j++) {
			var sqr = document.createElement("div"),
				color = getRandomColor(0, 100, 50, 5),
				obj = new SqrObj(i, j, sqr, color);
			sqr.setAttribute("class", "square");
			sqr.style.backgroundColor = color;
			// var img = "url('./images/papertexture_"+Math.floor(rand(1, 4))+".png')";
			// sqr.style.backgroundImage = img;
			sqr.addEventListener("mouseover", function(event) {
				event.target.style.backgroundColor = HSLstring(mouseoverHSL);
			});
			sqr.addEventListener("mouseleave", (function(c) {
				return function(event) {
					this.style.backgroundColor = c;
				}
			}) (color));
			sqr.addEventListener("mouseup", (function(x, y) {
				return function(event) {
					waves.push(new Wave(x, y));
				}
			}) (i, j));
			row.appendChild(sqr);
			rowArray.push(obj);
		}
	}
}

function run() {
	requestAnimationFrame(run);
	for (var i = 0; i < waves.length; i++) {
		waves[i].animate();
		if (waves[i].isDone()) 
			waves.splice(i--, 1);
	}
}

makeSquares(numSquares);
run();
});