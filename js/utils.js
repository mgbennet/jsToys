function rand(min, max) {
	return min + Math.random() * (max - min);
}

function HSLstring(hslArray) {
	return "hsl(" + hslArray[0] + "," + hslArray[1] + "%," + hslArray[2] + "%)";
}

function getRandomColor(baseH, baseS, baseL, range) {
	let h = baseH + rand(-range, range);
	let s = baseS + rand(-range, range);
	if (s > 100) s = 100;
	if (s < 0) s = 0;
	let l = baseL + rand(-range, range);
	if (l > 100) l = 100;
	if (l < 0) l = 0;
	return HSLstring([h, s, l]);
}