document.addEventListener("DOMContentLoaded", function (event) {
	const c = document.getElementById("myCanvas"),
		ctx = c.getContext("2d"),
		H = Math.sqrt(3) / 2,
        triangleSlope = Math.tan(Math.PI / 3);

    // draw equalatorla triangle
    function drawTriangle(centerX, centroidY, side) {
        ctx.beginPath();
        ctx.moveTo(centerX - side / 2, centroidY - side * H / 3);
        ctx.lineTo(centerX + side / 2, centroidY - side * H / 3);
        ctx.lineTo(centerX, centroidY + 2 * H * side / 3);
        ctx.lineTo(centerX - side / 2, centroidY - side * H / 3);
        ctx.strokeStyle = "#000";
        ctx.stroke();
    }

    // draw vector that doesn't extend past sides of triangle
    function makeTriangleVector(centerX, centroidY, side, mousePos) {
        const distance =
            Math.sqrt(Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centroidY, 2));
        ctx.beginPath();
        ctx.fillStyle = "rgb(54, 184, 54)";
        ctx.strokeStyle = "rgb(54, 184, 54)";
        ctx.arc(centerX, centroidY, 3, 0, 2 * Math.PI);

        ctx.moveTo(centerX, centroidY);
        const xVector = mousePos.x - centerX;
        const yVector = mousePos.y - centroidY;
        const calculatedIntersection = triangleIntersection(xVector, yVector, side);
        ctx.lineTo(centerX + calculatedIntersection.x, centroidY + calculatedIntersection.y);

        ctx.fill();
        ctx.stroke();
    }

    // given a vector from the center of a triangle, calculates where that
    // vector will hit the side of an equalatoral triangle. a negative side
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


    function getMousePos(canvas, evt) {
		const rect = canvas.getBoundingClientRect();
		return {
			x : evt.clientX - rect.left,
			y : evt.clientY - rect.top
		}
	}

	const drawFrame = function (evt) {
		ctx.clearRect(0, 0, c.width, c.height);
		const mousePos = getMousePos(c, evt);

        drawTriangle(250, 150, 100);
        drawTriangle(250, 300, -100);
        makeTriangleVector(250, 150, 100, mousePos);
        makeTriangleVector(250, 300, -100, mousePos);
	}

	document.addEventListener('mousemove', drawFrame, false);
    drawFrame({
		clientX : 250,
		clientY : 250
	});
});